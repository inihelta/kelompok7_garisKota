import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Menu({ auth }: { auth: any }) {
    return (
        <AuthenticatedLayout
            user={auth?.user}
            activeNav="Menu
        "
        >
            <Head title="Menu" />
        </AuthenticatedLayout>
    );
}
