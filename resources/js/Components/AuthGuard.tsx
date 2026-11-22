import { useEffect } from "react";
import { usePage, router } from "@inertiajs/react";

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
    const { props } = usePage<{ auth: { user: { id: number } | null } }>();

    useEffect(() => {
        if (requireAuth && !props.auth?.user) {
            router.visit("/login", { replace: true });
        }
    }, [props.auth?.user, requireAuth]);

    if (requireAuth && !props.auth?.user) {
        return null;
    }

    return <>{children}</>;
}