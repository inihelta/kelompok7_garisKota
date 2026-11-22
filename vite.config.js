import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/css/app.css",
                "resources/js/app.tsx",
            ],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": "/resources/js",
        },
    },
    build: {
        rollupOptions: {
            output: {
                // Vendor dipisah supaya file besar (react/inertia) tidak ikut
                // berubah hash setiap kali kode aplikasi berubah — cache browser
                // tetap valid. recharts tetap chunk terpisah agar tidak ikut
                // diunduh di halaman yang tidak memakai chart.
                manualChunks: {
                    vendor: ["react", "react-dom", "@inertiajs/react"],
                    "vendor-charts": ["recharts"],
                },
            },
        },
    },
    server: {
        watch: {
            ignored: ["**/storage/framework/views/**"],
        },
    },
});
