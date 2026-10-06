import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Pesanan({ auth }: { auth: any }) {
    return (
        <AuthenticatedLayout user={auth?.user} activeNav="Pesanan">
            <Head title="Pesanan" />
        </AuthenticatedLayout>
    );
}
