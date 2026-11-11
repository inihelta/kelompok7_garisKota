import { Utensils } from "lucide-react";

interface TopSellingItem {
    id: number;
    name: string;
    image: string | null;
    price: number;
    total_sold: number;
}

interface TopSellingProps {
    topSelling: TopSellingItem[] | null;
}

const getImageSrc = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http") || imagePath.startsWith("/")) {
        return imagePath;
    }
    return `/storage/${imagePath}`;
};

export default function TopSelling({ topSelling }: TopSellingProps) {
    return (
        <div className="border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col justify-between shadow-xs">
            <div className="flex items-center gap-2 mb-3">
                <Utensils className="w-5 h-5 text-[#D91A20]" />
                <h3 className="font-bold text-base text-[#1e293b]">
                    Top - Selling
                </h3>
            </div>

            {topSelling && topSelling.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 my-auto">
                    {topSelling.map((menu) => (
                        <div
                            key={menu.id}
                            className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden mb-1.5 p-1">
                                {menu.image ? (
                                    <img
                                        src={getImageSrc(menu.image) || ""}
                                        alt={menu.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLElement).style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <Utensils className="w-6 h-6 text-gray-300" />
                                )}
                            </div>
                            <span
                                className="text-xs font-semibold text-[#1e293b] leading-tight line-clamp-2 max-w-full"
                                title={menu.name}
                            >
                                {menu.name}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center text-gray-400 text-xs">
                    Belum ada menu terjual.
                </div>
            )}
        </div>
    );
}