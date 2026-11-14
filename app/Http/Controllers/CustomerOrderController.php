<?php

namespace App\Http\Controllers;

use App\Helpers\TableToken;
use App\Models\Category;
use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class CustomerOrderController extends Controller
{
    /**
     * Halaman katalog pemesanan pelanggan untuk meja tertentu.
     */
    public function show(string $token)
    {
        $table = TableToken::resolve($token);

        if (!$table) {
            return Inertia::render('Customer/OrderCatalog', [
                'table' => null,
                'categories' => [],
                'menus' => [],
                'isInvalidTable' => true,
                'error' => 'Meja tidak ditemukan atau kode QR tidak valid. Silakan scan ulang QR code di meja Anda.',
            ]);
        }

        $categories = Category::select('id', 'name')->orderBy('id')->get();

        $menus = Menu::with('category:id,name')
            ->where('status', 'tersedia')
            ->orderBy('category_id')
            ->orderBy('name')
            ->get()
            ->map(function ($menu) {
                return [
                    'id' => $menu->id,
                    'name' => $menu->name,
                    'description' => $menu->description ?? '',
                    'price' => (float) $menu->price,
                    'image' => $menu->image,
                    'stock' => (int) $menu->stock,
                    'status' => $menu->status,
                    'category_id' => $menu->category_id,
                    'category_name' => $menu->category?->name ?? 'Lainnya',
                ];
            });

        return Inertia::render('Customer/OrderCatalog', [
            'table' => [
                'id' => $table->id,
                'table_number' => $table->table_number,
                'location' => $table->location,
                'capacity' => $table->capacity,
                'available' => $table->available,
                'token' => TableToken::generate($table->id),
            ],
            'categories' => $categories,
            'menus' => $menus,
            'isInvalidTable' => false,
            'error' => null,
        ]);
    }

    /**
     * Menyimpan pesanan dari pelanggan.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_token' => 'required|string',
            'customer_name' => 'required|string|trim|max:100',
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1|max:50',
            'items.*.notes' => 'nullable|string|max:255',
        ], [
            'customer_name.required' => 'Mohon masukkan nama pemesan.',
            'items.min' => 'Pilih minimal satu menu untuk dipesan.',
        ]);

        $table = TableToken::resolve($validated['table_token']);

        if (!$table) {
            return back()->withErrors(['table' => 'Meja tidak valid. Silakan scan ulang QR code.']);
        }

        try {
            $order = DB::transaction(function () use ($validated, $table) {
                $menuIds = collect($validated['items'])->pluck('menu_id');
                $menus = Menu::whereIn('id', $menuIds)->lockForUpdate()->get()->keyBy('id');

                $totalPrice = 0;
                $orderItemsData = [];

                foreach ($validated['items'] as $item) {
                    $menu = $menus->get($item['menu_id']);
                    if (!$menu) {
                        throw new \Exception("Menu tidak ditemukan.");
                    }

                    if ($menu->status !== 'tersedia') {
                        throw new \Exception("Menu '{$menu->name}' sedang tidak tersedia.");
                    }

                    if ($menu->stock < $item['quantity']) {
                        throw new \Exception("Stok untuk menu '{$menu->name}' tersisa {$menu->stock}.");
                    }

                    $unitPrice = (float) $menu->price;
                    $itemTotal = $unitPrice * $item['quantity'];
                    $totalPrice += $itemTotal;

                    // Kurangi stok menu
                    $menu->decrement('stock', $item['quantity']);

                    $orderItemsData[] = [
                        'menu_id' => $menu->id,
                        'quantity' => $item['quantity'],
                        'unit_price' => $unitPrice,
                        'notes' => !empty($item['notes']) ? trim($item['notes']) : null,
                    ];
                }

                // Buat Order
                $order = Order::create([
                    'table_id' => $table->id,
                    'customer_name' => $validated['customer_name'],
                    'order_type' => 'dine_in',
                    'total_price' => $totalPrice,
                    'order_status' => 'pending',
                ]);

                // Buat Order Items
                foreach ($orderItemsData as $orderItem) {
                    $order->orderItems()->create($orderItem);
                }

                // Buat Payment Record (Cash di Kasir)
                Payment::create([
                    'order_id' => $order->id,
                    'payment_method' => 'cash',
                    'payment_amount' => $totalPrice,
                    'payment_status' => 'pending',
                    'transaction_ref' => 'GK-' . strtoupper(uniqid()),
                ]);

                return $order;
            });

            // Simpan ID pesanan ke session pelanggan untuk proteksi otorisasi halaman status
            $placedOrders = session('placed_orders', []);
            $placedOrders[] = $order->id;
            session(['placed_orders' => array_unique($placedOrders)]);

            return redirect()->route('order.status', $order->id);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Halaman status & detail pesanan pelanggan.
     */
    public function status(Order $order)
    {
        // Proteksi: Pelanggan hanya bisa melihat pesanannya sendiri di browsernya,
        // kecuali staf yang sedang login atau sedang dalam mode local/dev testing.
        $placedOrders = session('placed_orders', []);
        $isOwner = in_array($order->id, $placedOrders);
        $isStaff = auth()->check();

        if (!$isOwner && !$isStaff && !app()->environment('local', 'testing')) {
            abort(403, 'Anda tidak memiliki akses untuk melihat status pesanan ini.');
        }

        $order->load(['table', 'orderItems.menu', 'payment']);

        return Inertia::render('Customer/OrderStatus', [
            'order' => [
                'id' => $order->id,
                'customer_name' => $order->customer_name,
                'table_number' => $order->table?->table_number ?? '-',
                'location' => $order->table?->location ?? 'indoor',
                'order_status' => $order->order_status,
                'total_price' => (float) $order->total_price,
                'created_at' => $order->created_at?->toISOString(),
                'formatted_time' => $order->created_at
                    ? Carbon::parse($order->created_at)->locale('id')->translatedFormat('d M Y, H:i')
                    : '-',
                'order_items' => $order->orderItems->map(fn($item) => [
                    'id' => $item->id,
                    'name' => $item->menu?->name ?? 'Menu',
                    'image' => $item->menu?->image,
                    'quantity' => (int) $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'notes' => $item->notes,
                ]),
                'payment' => [
                    'method' => $order->payment?->payment_method ?? 'cash',
                    'status' => $order->payment?->payment_status ?? 'pending',
                    'amount' => (float) ($order->payment?->payment_amount ?? $order->total_price),
                    'ref' => $order->payment?->transaction_ref,
                ],
                'table_token' => $order->table ? TableToken::generate($order->table->id) : null,
            ],
        ]);
    }
}

