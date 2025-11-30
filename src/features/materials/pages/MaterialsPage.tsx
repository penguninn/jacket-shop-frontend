import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export default function MaterialsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Materials</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Materials Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Materials content will go here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
