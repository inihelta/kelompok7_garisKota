import { Link } from "@inertiajs/react";
import { House, ClipboardList, Wallet, Utensils, Archive } from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    activeNav?: string;
}

export default function Sidebar({
    isOpen,
    activeNav = "Dashboard",
}: SidebarProps) {
    const navItems = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            icon: House,
        },
        {
            name: "Pesanan",
            href: route("dashboard.pesanan"),
            icon: ClipboardList,
        },
        {
            name: "Pendapatan",
            href: route("dashboard.pendapatan"),
            icon: Wallet,
        },
        {
            name: "Menu",
            href: route("dashboard.menu"),
            icon: Utensils,
        },
        {
            name: "Stok",
            href: route("dashboard.stok"),
            icon: Archive,
        },
    ];

    return (
        <aside
            id="sidebar"
            className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#e5e7eb] transition-transform duration-200 ease-in-out ${
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
        >
            <Link
                href="/dashboard"
                className="flex h-[120px] items-center justify-center"
            >
                <img
                    src="/logoRed.png"
                    alt="Garis Kota"
                    className="h-[72px] w-auto block"
                />
            </Link>

            <nav className="flex flex-col gap-2 pt-[13px] pr-[12px] pb-0 pl-[11px]">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.name === activeNav;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-2 h-[47px] pl-[23px] rounded-[10px] text-[16px] transition-[background-color,color] duration-150 ${
                                isActive
                                    ? "font-bold text-[#e31b23] bg-[#fde8e8] hover:bg-[#fef2f2] hover:text-[#e31b23]"
                                    : "font-normal text-[#1f2937] hover:bg-[#fef2f2] hover:text-[#e31b23]"
                            }`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <Icon className="w-[25px] h-[25px] shrink-0" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
