<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\category;
use App\Models\menu;
use App\Models\table;
use App\Models\order;
use App\Models\orderItem;
use App\Models\payment;
use App\Models\StockCategory;
use App\Models\Stock;
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

        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
            ]
        );


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

        // Data Seeder meja
        $tables = [
            ['table_number' => 1, 'capacity' => 2, 'available' => true, 'location' => 'indoor'],
            ['table_number' => 2, 'capacity' => 4, 'available' => false, 'location' => 'indoor'],
            ['table_number' => 3, 'capacity' => 4, 'available' => true, 'location' => 'indoor'],
            ['table_number' => 4, 'capacity' => 6, 'available' => false, 'location' => 'indoor'],
            ['table_number' => 5, 'capacity' => 4, 'available' => true, 'location' => 'outdoor'],
            ['table_number' => 6, 'capacity' => 2, 'available' => false, 'location' => 'outdoor'],
            ['table_number' => 7, 'capacity' => 4, 'available' => true, 'location' => 'outdoor'],
            ['table_number' => 8, 'capacity' => 8, 'available' => true, 'location' => 'outdoor'],
        ];

        $createdTables = [];
        foreach ($tables as $tableData) {
            $createdTables[$tableData['table_number']] = table::updateOrCreate(
                ['table_number' => $tableData['table_number']],
                $tableData
            );
        }

        // Ambil referensi menu untuk pemesanan
        $nasgor = menu::where('name', 'Nasi Goreng')->first();
        $kentang = menu::where('name', 'Kentang Goreng')->first();
        $mixPlatter = menu::where('name', 'Mix Platter')->first();
        $matcha = menu::where('name', 'Matcha Latte')->first();
        $hazelnut = menu::where('name', 'Hazelnut Latte')->first();
        $espresso = menu::where('name', 'Espresso')->first();

        // Data Seeder Orders, Order Items, & Payments
        // Order 1 (Meja 2 - Dine In - Processing)
        if (isset($createdTables[2]) && $nasgor && $kentang) {
            $order1 = order::updateOrCreate(
                [
                    'table_id' => $createdTables[2]->id,
                    'order_status' => 'processing',
                ],
                [
                    'order_type' => 'dine-in',
                    'total_price' => 48000,
                ]
            );

            orderItem::firstOrCreate(
                [
                    'order_id' => $order1->id,
                    'menu_id' => $nasgor->id,
                ],
                [
                    'quantity' => 2,
                    'unit_price' => 18000,
                    'notes' => 'Pedas sedang',
                ]
            );

            orderItem::firstOrCreate(
                [
                    'order_id' => $order1->id,
                    'menu_id' => $kentang->id,
                ],
                [
                    'quantity' => 1,
                    'unit_price' => 12000,
                    'notes' => null,
                ]
            );

            payment::updateOrCreate(
                ['order_id' => $order1->id],
                [
                    'payment_method' => 'qris',
                    'payment_amount' => 48000,
                    'payment_status' => 'pending',
                    'transaction_ref' => 'QRIS-20261104-001',
                ]
            );
        }

        // Order 2 (Meja 4 - Dine In - Pending)
        if (isset($createdTables[4]) && $mixPlatter && $matcha) {
            $order2 = order::updateOrCreate(
                [
                    'table_id' => $createdTables[4]->id,
                    'order_status' => 'pending',
                ],
                [
                    'order_type' => 'dine-in',
                    'total_price' => 65000,
                ]
            );

            orderItem::firstOrCreate(
                [
                    'order_id' => $order2->id,
                    'menu_id' => $mixPlatter->id,
                ],
                [
                    'quantity' => 1,
                    'unit_price' => 25000,
                    'notes' => 'Saus dipisah',
                ]
            );

            orderItem::firstOrCreate(
                [
                    'order_id' => $order2->id,
                    'menu_id' => $matcha->id,
                ],
                [
                    'quantity' => 2,
                    'unit_price' => 20000,
                    'notes' => 'Less sugar',
                ]
            );

            payment::updateOrCreate(
                ['order_id' => $order2->id],
                [
                    'payment_method' => 'cash',
                    'payment_amount' => 65000,
                    'payment_status' => 'pending',
                    'transaction_ref' => null,
                ]
            );
        }

        // Order 3 (Meja 6 - Dine In - Completed)
        if (isset($createdTables[6]) && $hazelnut && $espresso) {
            $order3 = order::updateOrCreate(
                [
                    'table_id' => $createdTables[6]->id,
                    'order_status' => 'completed',
                ],
                [
                    'order_type' => 'dine-in',
                    'total_price' => 32000,
                ]
            );

            orderItem::firstOrCreate(
                [
                    'order_id' => $order3->id,
                    'menu_id' => $hazelnut->id,
                ],
                [
                    'quantity' => 1,
                    'unit_price' => 20000,
                    'notes' => 'Hangat',
                ]
            );

            orderItem::firstOrCreate(
                [
                    'order_id' => $order3->id,
                    'menu_id' => $espresso->id,
                ],
                [
                    'quantity' => 1,
                    'unit_price' => 12000,
                    'notes' => null,
                ]
            );

            payment::updateOrCreate(
                ['order_id' => $order3->id],
                [
                    'payment_method' => 'e_wallet',
                    'payment_amount' => 32000,
                    'payment_status' => 'done',
                    'transaction_ref' => 'EWAL-20261104-003',
                ]
            );
        }

        // Order 4 (Meja 1 - Takeaway - Completed)
        if (isset($createdTables[1]) && $hazelnut && $matcha) {
            $order4 = order::updateOrCreate(
                [
                    'table_id' => $createdTables[1]->id,
                    'order_type' => 'takeaway',
                    'order_status' => 'completed',
                ],
                [
                    'total_price' => 40000,
                ]
            );

            orderItem::firstOrCreate(
                [
                    'order_id' => $order4->id,
                    'menu_id' => $hazelnut->id,
                ],
                [
                    'quantity' => 1,
                    'unit_price' => 20000,
                    'notes' => 'Takeaway cup',
                ]
            );

            orderItem::firstOrCreate(
                [
                    'order_id' => $order4->id,
                    'menu_id' => $matcha->id,
                ],
                [
                    'quantity' => 1,
                    'unit_price' => 20000,
                    'notes' => 'Takeaway cup',
                ]
            );

            payment::updateOrCreate(
                ['order_id' => $order4->id],
                [
                    'payment_method' => 'cash',
                    'payment_amount' => 40000,
                    'payment_status' => 'done',
                    'transaction_ref' => null,
                ]
            );
        }

        // Data Seeder Kategori Bahan Baku & Stok
        $catKopi = StockCategory::firstOrCreate(
            ['name' => 'Biji Kopi & Bubuk'],
            ['icon' => 'coffee']
        );
        $catDairy = StockCategory::firstOrCreate(
            ['name' => 'Susu & Dairy'],
            ['icon' => 'milk']
        );
        $catSirup = StockCategory::firstOrCreate(
            ['name' => 'Sirup & Topping'],
            ['icon' => 'droplet']
        );
        $catPackaging = StockCategory::firstOrCreate(
            ['name' => 'Packaging & Cup'],
            ['icon' => 'cup']
        );
        $catMakanan = StockCategory::firstOrCreate(
            ['name' => 'Bahan Makanan'],
            ['icon' => 'food']
        );

        $stockItems = [
            [
                'stock_category_id' => $catKopi->id,
                'name' => 'House Blend Beans',
                'sku' => 'SKU-COF-01',
                'stock' => 6.4,
                'unit' => 'kg',
                'min_stock' => 5.0,
                'est_daily' => 1.8,
            ],
            [
                'stock_category_id' => $catDairy->id,
                'name' => 'Fresh Milk Pasteurisasi 1L',
                'sku' => 'SKU-MLK-01',
                'stock' => 6,
                'unit' => 'Liter',
                'min_stock' => 8,
                'est_daily' => 8,
            ],
            [
                'stock_category_id' => $catDairy->id,
                'name' => 'Oat Milk Barista 1L',
                'sku' => 'SKU-MLK-02',
                'stock' => 10,
                'unit' => 'Liter',
                'min_stock' => 8,
                'est_daily' => 8,
            ],
            [
                'stock_category_id' => $catSirup->id,
                'name' => 'Hazelnut Syrup 750ML',
                'sku' => 'SKU-SYR-01',
                'stock' => 2,
                'unit' => 'Botol',
                'min_stock' => 4,
                'est_daily' => 6,
            ],
            [
                'stock_category_id' => $catSirup->id,
                'name' => 'Caramel Syrup 750ML',
                'sku' => 'SKU-SYR-02',
                'stock' => 3,
                'unit' => 'Botol',
                'min_stock' => 4,
                'est_daily' => 6,
            ],
            [
                'stock_category_id' => $catSirup->id,
                'name' => 'Berry Syrup 750ML',
                'sku' => 'SKU-SYR-03',
                'stock' => 3,
                'unit' => 'Botol',
                'min_stock' => 4,
                'est_daily' => 6,
            ],
            [
                'stock_category_id' => $catPackaging->id,
                'name' => 'Paper Cup 12oz',
                'sku' => 'SKU-PKG-01',
                'stock' => 250,
                'unit' => 'Pcs',
                'min_stock' => 100,
                'est_daily' => 50,
            ],
            [
                'stock_category_id' => $catMakanan->id,
                'name' => 'Beras Pandan Wangi',
                'sku' => 'SKU-FOD-01',
                'stock' => 15,
                'unit' => 'kg',
                'min_stock' => 10,
                'est_daily' => 3,
            ],
        ];

        foreach ($stockItems as $item) {
            Stock::updateOrCreate(
                ['sku' => $item['sku']],
                $item
            );
        }
    }
}
