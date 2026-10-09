import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Stok({ auth }: { auth: any }) {
    return (
        <AuthenticatedLayout
            user={auth?.user}
            activeNav="Stok
        "
        >
            <Head title="Stok" />
        </AuthenticatedLayout>
    );
}
