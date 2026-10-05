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
            'email' => 'admin@gmail.com',
            'name' => 'Admin',
            'password' => Hash::make('password'),
        ]);


        $makanan = category::firstOrCreate(['name' => 'Makanan']);
        $minuman = category::firstOrCreate(['name' => 'Minuman']);
        $snack = category::firstOrCreate(['name' => 'Snack']);

        $menus = [
            // Makanan
            [
                'category_id' => $makanan->id,
                'name' => 'Nasi Goreng',
                'description' => 'Nasi goreng spesial dengan bumbu khas dan topping lezat.',
                'price' => 18000,
                'image' => 'menus/DEF_nasgor.png',
                'stock' => 20,
                'status' => 'tersedia',
            ],

            // Minuman
            [
                'category_id' => $minuman->id,
                'name' => 'Americano',
                'description' => 'Kopi hitam espresso dengan air panas yang kaya aroma.',
                'price' => 15000,
                'image' => 'menus/DEF_americano.png',
                'stock' => 25,
                'status' => 'tersedia',
            ],
            [
                'category_id' => $minuman->id,
                'name' => 'Espresso',
                'description' => 'Ekstraksi kopi murni dengan rasa pekat dan aroma kuat.',
                'price' => 12000,
                'image' => 'menus/DEF_espresso.png',
                'stock' => 30,
                'status' => 'tersedia',
            ],
            [
                'category_id' => $minuman->id,
                'name' => 'Hazelnut Latte',
                'description' => 'Perpaduan kopi espresso, susu lembut, dan sirup hazelnut manis.',
                'price' => 20000,
                'image' => 'menus/DEF_hazelnut.png',
                'stock' => 15,
                'status' => 'tersedia',
            ],
            [
                'category_id' => $minuman->id,
                'name' => 'Matcha Latte',
                'description' => 'Minuman teh hijau Jepang premium dengan paduan susu segar.',
                'price' => 20000,
                'image' => 'menus/DEF_matcha.png',
                'stock' => 18,
                'status' => 'tersedia',
            ],

            // Snack
            [
                'category_id' => $snack->id,
                'name' => 'Kentang Goreng',
                'description' => 'Kentang goreng renyah dan gurih dengan bumbu spesial.',
                'price' => 12000,
                'image' => 'menus/DEF_kentang.png',
                'stock' => 20,
                'status' => 'tersedia',
            ],
            [
                'category_id' => $snack->id,
                'name' => 'Mix Platter',
                'description' => 'Kombinasi sosis, kentang, dan nugget lezat untuk cemilan bersama.',
                'price' => 25000,
                'image' => 'menus/DEF_mix platter.png',
                'stock' => 15,
                'status' => 'tersedia',
            ],
            [
                'category_id' => $snack->id,
                'name' => 'Pisang Crispy',
                'description' => 'Pisang goreng manis dan renyah dengan taburan topping spesial.',
                'price' => 13000,
                'image' => 'menus/DEF_pisang.png',
                'stock' => 22,
                'status' => 'tersedia',
            ],
            [
                'category_id' => $snack->id,
                'name' => 'Roti Bakar',
                'description' => 'Roti bakar empuk dipanggang hangat dengan selai dan keju pilihan.',
                'price' => 15000,
                'image' => 'menus/DEF_roti.png',
                'stock' => 16,
                'status' => 'tersedia',
            ],
        ];

        foreach ($menus as $menuData) {
            menu::updateOrCreate(
                ['name' => $menuData['name']],
                $menuData
            );
        }
    }
}
