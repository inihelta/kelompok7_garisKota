import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Dashboard({ auth }: { auth: any }) {
    return (
        <AuthenticatedLayout user={auth?.user} activeNav="Dashboard">
            <Head title="Dashboard" />
        </AuthenticatedLayout>
    );
}
