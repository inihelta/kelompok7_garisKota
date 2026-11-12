import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatIDR = (value: number | string): string =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Number(value) || 0)

export const getImageSrc = (imagePath?: string): string => {
    if (!imagePath) return ""
    if (imagePath.startsWith("http") || imagePath.startsWith("/")) return imagePath
    return `/storage/${imagePath}`
}

export const getCategoryBadgeClass = (categoryId: number): string => {
    switch (categoryId) {
        case 1:
            return "bg-[#fee2e2] text-[#ef4444]"
        case 2:
            return "bg-[#dbeafe] text-[#2563eb]"
        case 3:
            return "bg-[#ffedd5] text-[#ea580c]"
        default:
            return "bg-gray-100 text-gray-700"
    }
}

export const getStatusBadgeClass = (status: string): string => {
    switch (status) {
        case "tersedia":
            return "bg-[#dcfce7] text-[#16a34a]"
        case "draft":
            return "bg-[#fef3c7] text-[#d97706]"
        case "nonaktif":
            return "bg-[#fee2e2] text-[#ef4444]"
        case "Aman":
            return "bg-[#dcfce7] text-[#16a34a]"
        case "Menipis":
            return "bg-[#fee2e2] text-[#ef4444]"
        default:
            return "bg-gray-100 text-gray-700"
    }
}

export const formatEstDaily = (est: number | string, unit: string): string => {
    if (!est && est !== 0) return "-"
    if (typeof est === "string" && est.startsWith("~")) return est
    const unitLabel = unit === "Liter" ? "L" : unit
    return `~${est} ${unitLabel}/hari`
}