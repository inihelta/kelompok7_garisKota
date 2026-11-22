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

// Base URL mengikuti MENU_DISK di backend: "/storage" untuk local, URL bucket untuk s3
const STORAGE_BASE = (import.meta.env.VITE_STORAGE_URL as string | undefined) ?? "/storage"

export const getImageSrc = (imagePath?: string): string => {
    if (!imagePath) return ""
    if (imagePath.startsWith("http") || imagePath.startsWith("/")) return imagePath
    return `${STORAGE_BASE.replace(/\/+$/, "")}/${imagePath}`
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

// TableToken helper (port dari PHP App\Helpers\TableToken)
const TABLE_TOKEN_SALT = "7980312123789"

function getSaltHash(): string {
    // Simple hash - dalam production sebaiknya pakai crypto.subtle
    let hash = 0
    const str = TABLE_TOKEN_SALT
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return Math.abs(hash).toString(16)
}

export function generateTableToken(tableId: number): string {
    // Port dari PHP: substr(hash('sha256', $tableId . self::getSalt()), 0, 6)
    // JS version: simple hash combinaton
    const combined = `${tableId}${TABLE_TOKEN_SALT}`
    let hash = 0
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    const hashPart = Math.abs(hash).toString(16).substring(0, 6)
    
    // base_convert($tableId, 10, 36) in PHP
    const encodedId = tableId.toString(36)
    
    return `${encodedId}-${hashPart}`
}

export function getTableOrderUrl(tableId: number): string {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    const token = generateTableToken(tableId)
    return `${baseUrl}/order/${token}`
}