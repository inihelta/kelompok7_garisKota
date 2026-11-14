export interface CustomerTable {
    id: number;
    table_number: number;
    location: "indoor" | "outdoor";
    capacity: number;
    available: boolean;
    token: string;
}

export interface CustomerCategory {
    id: number;
    name: string;
}

export interface CustomerMenu {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    status: string;
    category_id: number;
    category_name: string;
}

export interface CartItem {
    menu: CustomerMenu;
    quantity: number;
    notes: string;
}

export interface OrderStatusData {
    id: number;
    customer_name: string;
    table_number: number | string;
    location: string;
    order_status: "pending" | "processing" | "completed" | "cancelled";
    total_price: number;
    created_at?: string;
    formatted_time: string;
    order_items: {
        id: number;
        name: string;
        image?: string;
        quantity: number;
        unit_price: number;
        notes?: string | null;
    }[];
    payment: {
        method: string;
        status: string;
        amount: number;
        ref?: string;
    };
    table_token?: string | null;
}

