<?php

namespace App\Console\Commands;

use App\Models\Menu;
use App\Services\ImageOptimizer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class OptimizeMenuImages extends Command
{
    protected $signature = 'images:optimize {--dry-run : Hanya tampilkan ukuran, tanpa mengubah file}';

    protected $description = 'Konversi gambar menu (png/jpg) menjadi WebP agar halaman katalog lebih cepat';

    public function handle(): int
    {
        $disk = config('filesystems.menu');
        $storage = Storage::disk($disk);
        $files = $storage->files('menus');

        $converted = 0;
        $skipped = 0;
        $failed = 0;
        $savedBytes = 0;

        foreach ($files as $path) {
            if (str_ends_with(strtolower($path), '.webp')) {
                $skipped++;
                continue;
            }

            $oldSize = (int) $storage->size($path);

            if ($this->option('dry-run')) {
                $this->line(sprintf('%-50s %6.0f KB', $path, $oldSize / 1024));
                continue;
            }

            $newPath = ImageOptimizer::replaceFile($path, $disk);

            if ($newPath === null) {
                $failed++;
                $this->warn("Gagal memproses: {$path} (dibiarkan apa adanya)");
                continue;
            }

            $newSize = (int) $storage->size($newPath);

            // Hapus file lama hanya setelah konversi sukses
            $storage->delete($path);

            // Ada menu yang menunjuk path lama? Pindahkan ke path baru.
            Menu::where('image', $path)->update(['image' => $newPath]);

            $converted++;
            $savedBytes += max(0, $oldSize - $newSize);

            $this->line(sprintf(
                '%-50s %6.0f KB → %6.0f KB',
                $path,
                $oldSize / 1024,
                $newSize / 1024
            ));
        }

        if ($this->option('dry-run')) {
            $this->info('Dry-run: tidak ada file yang diubah.');
            return self::SUCCESS;
        }

        $this->info(sprintf(
            '%d file dikonversi, %d dilewati (sudah webp), %d gagal. Hemat %.1f MB.',
            $converted,
            $skipped,
            $failed,
            $savedBytes / 1048576
        ));

        return self::SUCCESS;
    }
}
