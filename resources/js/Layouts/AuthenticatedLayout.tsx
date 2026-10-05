import { useState, PropsWithChildren } from "react";
import Sidebar from "@/Components/Sidebar";
import Header from "@/Components/Header";
import { User } from "@/types";

interface AuthenticatedLayoutProps {
    user?: User | null;
    activeNav?: string;
}

export default function AuthenticatedLayout({
    user,
    activeNav = "Dashboard",
    children,
}: PropsWithChildren<AuthenticatedLayoutProps>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="m-0 font-sans text-[#111827] bg-white antialiased min-h-screen">
            <Sidebar isOpen={sidebarOpen} activeNav={activeNav} />

            {/* Backdrop overlay for mobile drawer */}
            <div
                id="overlay"
                onClick={() => setSidebarOpen(false)}
                className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-200 lg:hidden ${
                    sidebarOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                }`}
            />

            <div className="min-h-screen lg:pl-64">
                <Header
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    user={user}
                />
                <main className="px-[22px] pt-[12px] pb-[24px]">
                    {children}
                </main>
            </div>
        </div>
    );
}
