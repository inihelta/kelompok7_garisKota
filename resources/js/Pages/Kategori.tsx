import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Kategori({ auth }: { auth: any }) {
    return (
        <AuthenticatedLayout user={auth?.user} activeNav="Kategori">
            <Head title="Kategori" />
        </AuthenticatedLayout>
    );
}
