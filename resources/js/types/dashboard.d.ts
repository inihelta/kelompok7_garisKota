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
