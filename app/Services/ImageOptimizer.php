<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageOptimizer
{
    public const MAX_WIDTH = 1024;
    public const QUALITY = 80;

    /**
     * Simpan gambar upload ke disk menu sebagai WebP.
     * Kalau gambar tidak bisa diproses, jatuh kembali ke format asli
     * agar gambar tetap tersimpan (bukan hilang).
     */
    public static function storeUpload(UploadedFile $file): string
    {
        $binary = self::toWebpBytes((string) file_get_contents($file->getRealPath()));

        if ($binary === null) {
            return $file->store('menus', config('filesystems.menu'));
        }

        $path = 'menus/' . Str::random(40) . '.webp';
        Storage::disk(config('filesystems.menu'))->put($path, $binary);

        return $path;
    }

    /**
     * Konversi file yang sudah ada di disk menjadi WebP.
     * Mengembalikan path baru; file lama TIDAK dihapus (pemanggil yang memutuskan).
     * Null = gagal diproses, biarkan file lama apa adanya.
     */
    public static function replaceFile(string $path, string $disk): ?string
    {
        $storage = Storage::disk($disk);

        if (! $storage->exists($path) || str_ends_with(strtolower($path), '.webp')) {
            return null;
        }

        $binary = self::toWebpBytes((string) $storage->get($path));

        if ($binary === null) {
            return null;
        }

        $newPath = preg_replace('/\.[^.]+$/', '', $path) . '.webp';
        $storage->put($newPath, $binary);

        return $newPath;
    }

    /**
     * Decode gambar (jpeg/png/webp) → resize maks 1024px → encode WebP.
     * Null kalau file bukan gambar yang bisa dibaca GD.
     */
    public static function toWebpBytes(string $binary): ?string
    {
        $source = @imagecreatefromstring($binary);

        if ($source === false) {
            return null;
        }

        $width = imagesx($source);
        $height = imagesy($source);

        if ($width > self::MAX_WIDTH) {
            $resized = imagescale($source, self::MAX_WIDTH, (int) round($height * self::MAX_WIDTH / $width));
            imagedestroy($source);

            if ($resized === false) {
                return null;
            }

            $source = $resized;
        }

        // Pertahankan transparansi PNG saat di-encode ke WebP
        imagealphablending($source, false);
        imagesavealpha($source, true);

        ob_start();
        imagewebp($source, null, self::QUALITY);
        $output = (string) ob_get_clean();

        imagedestroy($source);

        return $output === '' ? null : $output;
    }
}
