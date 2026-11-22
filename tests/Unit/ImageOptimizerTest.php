<?php

namespace Tests\Unit;

use App\Services\ImageOptimizer;
use Tests\TestCase;

class ImageOptimizerTest extends TestCase
{
    public function test_png_is_converted_to_valid_webp(): void
    {
        $png = $this->makePng(400, 300);

        $webp = ImageOptimizer::toWebpBytes($png);

        $this->assertNotNull($webp, 'PNG harus berhasil dikonversi');
        $this->assertSame('RIFF', substr($webp, 0, 4));
        $this->assertSame('WEBP', substr($webp, 8, 4));
    }

    public function test_large_image_is_resized_to_max_width(): void
    {
        $png = $this->makePng(1600, 900);

        $webp = ImageOptimizer::toWebpBytes($png);

        $this->assertNotNull($webp);
        $decoded = imagecreatefromstring($webp);
        $this->assertNotFalse($decoded);
        $this->assertSame(ImageOptimizer::MAX_WIDTH, imagesx($decoded));
        $this->assertSame(576, imagesy($decoded)); // 900 * 1024 / 1600
    }

    public function test_non_image_data_is_rejected(): void
    {
        $this->assertNull(ImageOptimizer::toWebpBytes('ini bukan gambar'));
    }

    private function makePng(int $width, int $height): string
    {
        $image = imagecreatetruecolor($width, $height);

        // Gradasi agar PNG-nya realistis (bukan data kosong)
        for ($x = 0; $x < $width; $x++) {
            for ($y = 0; $y < 40; $y++) {
                $color = imagecolorallocate($image, ($x * 255) % 256, ($y * 6) % 256, 128);
                imagesetpixel($image, $x, $y, $color);
            }
        }

        ob_start();
        imagepng($image);
        $binary = (string) ob_get_clean();
        imagedestroy($image);

        return $binary;
    }
}
