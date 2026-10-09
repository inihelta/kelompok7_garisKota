import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Pendapatan({ auth }: { auth: any }) {
    return (
        <AuthenticatedLayout
            user={auth?.user}
            activeNav="Pendapatan
        "
        >
            <Head title="Pendapatan" />
        </AuthenticatedLayout>
    );
}
