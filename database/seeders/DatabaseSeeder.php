<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\category;
use App\Models\menu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
        ]);
        category::create([
            'name' => 'Makanan',
        ]);
        category::create([
            'name' => 'Minuman',
        ]);
        category::create([
            'name' => 'Snack',
        ]);


        menu::create([
            'category_id' => 1,
            'name' => 'Nasi Goreng',
            'description' => 'Nasi goreng spesial dengan bumbu rahasia.',
            'price' => 15000,
            'image' => 'nasi_goreng.jpg',
            'stock' => 10,
            'status' => 'tersedia'
        ]);
        menu::create([
            'category_id' => 2,
            'name' => 'Es Teh Manis',
            'description' => 'Segelas es teh manis yang menyegarkan.',
            'price' => 5000,
            'image' => 'es_teh_manis.jpg',
            'stock' => 20,
            'status' => 'tersedia'
        ]);
        menu::create([
            'category_id' => 3,
            'name' => 'Keripik Singkong',
            'description' => 'Keripik singkong renyah dan gurih.',
            'price' => 8000,
            'image' => 'keripik_singkong.jpg',
            'stock' => 15,
            'status' => 'tersedia'
        ]);
        menu::create([
            'category_id' => 1,
            'name' => 'Mie Goreng',
            'description' => 'Mie goreng spesial dengan bumbu rahasia.',
            'price' => 12000,
            'image' => 'mie_goreng.jpg',
            'stock' => 12,
            'status' => 'tersedia'
        ]);
        menu::create([
            'category_id' => 2,
            'name' => 'Jus Jeruk',
            'description' => 'Segelas jus jeruk segar.',
            'price' => 7000,
            'image' => 'jus_jeruk.jpg',
            'stock' => 18,
            'status' => 'draft'
        ]);
        menu::create([
            'category_id' => 3,
            'name' => 'Kacang Goreng',
            'description' => 'Kacang goreng renyah dan gurih.',
            'price' => 6000,
            'image' => 'kacang_goreng.jpg',
            'stock' => 25,
            'status' => 'nonaktif'
        ]);
    }
}
