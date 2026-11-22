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
// PHP: getSalt() = hash('sha256', '7980312123789') -> 64 char hex
// PHP: generate() = substr(hash('sha256', $tableId . $salt), 0, 6) + base_convert($tableId, 10, 36)
const TABLE_TOKEN_SALT_RAW = "7980312123789"

// Precomputed SHA-256 of the raw salt (matches PHP hash('sha256', '7980312123789'))
const TABLE_TOKEN_SALT = "8056f8f532d758ef1a3e4d88f0889cedb73392c1970a787f6fbaac59c1e83c48"

async function sha256Hex(input: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}

export async function generateTableToken(tableId: number): Promise<string> {
    const salt = TABLE_TOKEN_SALT
    const combined = `${tableId}${salt}`
    const hash = await sha256Hex(combined)
    const hashPart = hash.substring(0, 6)
    
    // base_convert($tableId, 10, 36) in PHP
    const encodedId = tableId.toString(36)
    
    return `${encodedId}-${hashPart}`
}

export async function getTableOrderUrl(tableId: number): Promise<string> {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    const token = await generateTableToken(tableId)
    return `${baseUrl}/order/${token}`
}