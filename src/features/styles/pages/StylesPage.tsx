import { StylesTable } from "../components/StylesTable";
import { StyleCreateForm } from "../components/StyleCreateForm";

export default function StylesPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Styles Management</h1>
                    <p className="text-muted-foreground">
                        Manage jacket styles
                    </p>
                </div>
                <StyleCreateForm />
            </div>
            <StylesTable />
        </div>
    );
}
