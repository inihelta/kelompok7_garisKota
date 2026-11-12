import { Toaster } from "sonner";

export function Toast() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                classNames: {
                    toast: "bg-white text-gray-900 border border-gray-200 shadow-lg",
                    success: "bg-green-50 text-green-900 border-green-200",
                    error: "bg-red-50 text-red-900 border-red-200",
                    loading: "bg-blue-50 text-blue-900 border-blue-200",
                },
                style: {
                    borderRadius: "0.5rem",
                    padding: "1rem",
                },
            }}
        />
    );
}