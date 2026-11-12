import { useState } from "react";
import { Utensils, Package } from "lucide-react";

interface ImageWithFallbackProps {
    src: string;
    alt: string;
    className?: string;
    fallbackIcon?: React.ReactNode;
}

export function ImageWithFallback({
    src,
    alt,
    className = "",
    fallbackIcon,
}: ImageWithFallbackProps) {
    const [hasError, setHasError] = useState(false);

    if (hasError || !src) {
        return (
            <div
                className={`flex items-center justify-center bg-gray-100 ${className}`}
                aria-hidden="true"
            >
                {fallbackIcon || (
                    <Utensils className="w-6 h-6 text-gray-300" aria-hidden="true" />
                )}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setHasError(true)}
        />
    );
}