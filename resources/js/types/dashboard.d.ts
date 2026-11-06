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
