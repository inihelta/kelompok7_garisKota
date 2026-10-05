import { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
    Menu,
    Search,
    Bell,
    UserRound,
    ChevronDown,
    LogOut,
} from "lucide-react";

interface HeaderProps {
    onToggleSidebar: () => void;
    user?: { name?: string; email?: string } | null;
}

export default function Header({ onToggleSidebar, user }: HeaderProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-20 flex items-center gap-4 h-17 px-4 lg:pl-[22px] lg:pr-[30px] bg-white border-b border-[#e5e7eb]">
            <button
                className="block lg:hidden p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer bg-transparent border-0"
                id="toggle"
                type="button"
                aria-label="Buka menu"
                onClick={onToggleSidebar}
            >
                <Menu className="w-6 h-6 block" />
            </button>
            {/* 
            <form className="relative w-full max-w-[338px]" role="search" onSubmit={(e) => e.preventDefault()}>
                <Search className="absolute left-[10px] top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-[#e31b23] stroke-[2] pointer-events-none block" />
                <input
                    type="search"
                    className="w-full h-[39px] pl-[36px] pr-[10px] text-[12px] text-[#374151] bg-white border border-[#e5e7eb] rounded-[5px] placeholder-[#9ca3af] outline-none focus:border-[#f87171] focus:ring-3 focus:ring-[#fee2e2]"
                    placeholder="Cari menu, kategori, atau kode..."
                />
            </form> */}

            <div className="flex items-center gap-[18px] lg:gap-[30px] ml-auto">
                <button
                    className="relative text-[#1f2937] bg-transparent border-0 p-0 cursor-pointer"
                    type="button"
                    aria-label="Notifikasi"
                >
                    <Bell className="block w-5 h-5" />
                    <span className="absolute -top-[1px] right-0 w-[6px] h-[6px] rounded-full bg-[#e31b23]"></span>
                </button>

                <div className="relative p-2 rounded-md" ref={dropdownRef}>
                    <button
                        className="flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer"
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <span className="flex items-center justify-center p-[6px] rounded-full bg-[#111827] text-white">
                            <UserRound className="w-5 h-5 block" />
                        </span>
                        <span className="text-left leading-[1.3] mr-[14px] hidden min-[656px]:block">
                            <strong className="text-[16px] font-bold block">
                                {user?.name || "Garis Kota"}
                            </strong>
                            <small className="text-[12px] text-[#6b7280] block">
                                Admin
                            </small>
                        </span>
                        <ChevronDown className="w-5 h-5 ml-[14px] text-[#6b7280] hidden min-[656px]:block" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-1 z-50">
                            <Link
                                href={
                                    typeof route !== "undefined"
                                        ? route("logout")
                                        : "/logout"
                                }
                                method="get"
                                as="button"
                                className="w-full text-left px-4 py-2 text-[14px] text-[#374151] hover:bg-[#fee2e2] hover:text-[#dc2626] flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
