import "../css/app.css";

import { createInertiaApp, router } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import type { PageProps } from "@/types";
import { Toast } from "@/Components/ui/Toast";
import { ErrorBoundary } from "@/Components/ErrorBoundary";

const appName = import.meta.env.VITE_APP_NAME || "Garis Kota";

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx"),
        ) as any,
    setup({ el, App, props }) {
        const root = createRoot(el!);
        root.render(
            <ErrorBoundary>
                <App {...props} />
            </ErrorBoundary>
        );
    },
    progress: {
        color: "#dc2626",
    },
});

router.on("httpException", (event) => {
    if (event.detail.response.status === 419) {
        event.preventDefault();
        window.location.reload();
    }
});

// Mount Toast globally
const toastRoot = document.createElement("div");
toastRoot.id = "toast-root";
document.body.appendChild(toastRoot);
createRoot(toastRoot).render(<Toast />);
