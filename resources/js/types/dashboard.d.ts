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

export type StockCategoryIcon =
    | "coffee"
    | "milk"
    | "droplet"
    | "cup"
    | "food"
    | "package";

export interface StockCategoryItem {
    id: number;
    name: string;
    icon?: StockCategoryIcon;
    stocks_count?: number;
}

export interface StockItem {
    id: number;
    stock_category_id?: number;
    name: string;
    sku: string;
    category: string;
    stock: number;
    unit: string;
    min_stock: number;
    est_daily: number | string;
    status: "Aman" | "Menipis";
    icon_type?: StockCategoryIcon;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface OrderItemDetail {
    id: number;
    order_id: number;
    menu_id: number;
    menu?: MenuItem;
    menu_name?: string;
    menu_image?: string;
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
    customer_name?: string | null;
    order_type: "dine-in" | "takeaway";
    total_price: number | string;
    order_status: "pending" | "processing" | "completed" | "cancelled";
    created_at: string;
    formatted_time?: string;
    relative_time?: string;
    location?: string;
    order_items?: OrderItemDetail[];
    payment?: PaymentItem;
}
