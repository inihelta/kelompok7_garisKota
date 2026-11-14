import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse bg-gray-200 rounded", className)}
            {...props}
        />
    );
}

export function TableSkeleton({ columns = 5, rows = 5 }: { columns?: number; rows?: number }) {
    return (
        <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <td key={colIndex} className="px-4 py-3 border-b border-[#f1f5f9]">
                            <Skeleton className="h-4 w-full" />
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
}

export function CardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("border border-[#e5e7eb] rounded-xl p-5 bg-white shadow-xs", className)}>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/4 mt-2" />
        </div>
    );
}

export function ChartSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("border border-[#e5e7eb] rounded-xl p-5 bg-white shadow-xs", className)}>
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-1/2 mt-4 mx-auto" />
        </div>
    );
}

export function MenuCardSkeleton() {
    return (
        <div className="flex items-center justify-between gap-4 p-4 bg-white border-b border-gray-100">
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-1/3 rounded-md mt-2" />
            </div>
            <div className="flex flex-col items-end shrink-0 w-24 gap-2">
                <Skeleton className="h-20 w-20 rounded-xl" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
        </div>
    );
}