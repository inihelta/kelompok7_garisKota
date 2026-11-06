import { Link } from "@inertiajs/react";
import {
    House,
    ClipboardList,
    Wallet,
    Utensils,
    Archive,
    MenuSquare,
    LucideProps,
} from "lucide-react";

const TableIcon = ({
    color = "currentColor",
    size = 34,
    className = "",
    ...props
}: LucideProps) => (
    <svg
        width={size}
        height={(Number(size) * 27) / 34}
        viewBox="0 0 34 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`lucide ${className}`}
        {...props}
    >
        <path
            d="M33.2636 9.55L30.8802 1.21667C30.7833 0.86681 30.5743 0.558384 30.2853 0.338636C29.9963 0.118888 29.6433 -6.45253e-05 29.2802 2.62585e-08H4.04689C3.29689 2.62585e-08 2.64689 0.5 2.44689 1.21667L0.06356 9.55C-0.23644 10.6 0.56356 11.6667 1.66356 11.6667H5.33023L3.33023 26.6667H6.66356L7.78023 18.3333H25.5636L26.6636 26.6667H29.9969L27.9969 11.6667H31.6636C32.7636 11.6667 33.5636 10.6 33.2636 9.55ZM8.21356 15L8.66356 11.6667H24.6636L25.1136 15H8.21356ZM3.88023 8.33333L5.31356 3.33333H28.0302L29.4636 8.33333H3.88023Z"
            fill={color}
        />
    </svg>
);

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
            name: "Kategori",
            href: route("dashboard.kategori"),
            icon: MenuSquare,
        },
        {
            name: "Meja",
            href: route("dashboard.meja"),
            icon: TableIcon,
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
