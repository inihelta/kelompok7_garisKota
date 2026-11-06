export interface MenuItem {
    id: number;
    name: string;
    description: string;
    category_id: number;
    price: string;
    stock: number;
    status: "tersedia" | "draft" | "nonaktif";
    image: string;
}

export interface TableItem {
    id: number;
    table_number: number;
    capacity: number;
    available: boolean;
    location: "indoor" | "outdoor";
}

export interface CategoryItem {
    id: number;
    name: string;
    menus_count?: number;
    created_at?: string;
}

export interface StockItem {
    id: number;
    name: string;
    sku: string;
    category: string;
    stock: number;
    unit: string;
    min_stock: number;
    est_daily: number | string;
    status: "Aman" | "Menipis";
    icon_type?: "coffee" | "milk" | "droplet" | "cup" | "food" | "package";
}

export interface OrderItemDetail {
    id: number;
    order_id: number;
    menu_id: number;
    menu?: MenuItem;
    menu_name?: string;
    quantity: number;
    unit_price: number | string;
    notes?: string | null;
}

export interface PaymentItem {
    id: number;
    order_id: number;
    payment_method: "qris" | "bank_transfer" | "e_wallet" | "cash";
    payment_amount: number | string;
    payment_status: "pending" | "done";
    transaction_ref?: string | null;
    created_at?: string;
}

export interface OrderItem {
    id: number;
    table_id?: number | null;
    table?: TableItem;
    table_number?: number;
    order_type: "dine-in" | "takeaway";
    total_price: number | string;
    order_status: "pending" | "processing" | "completed" | "cancelled";
    created_at: string;
    order_items?: OrderItemDetail[];
    payment?: PaymentItem;
}
