export default function MyVouchersPage() {
    return (
        <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden">
            <div className="border-b px-6 py-4">
                <h2 className="text-lg font-medium">My Vouchers</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your available discounts and promotional codes
                </p>
            </div>
            <div className="flex-1 p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="border rounded-lg p-4 bg-card text-card-foreground shadow-sm">
                        <p className="text-muted-foreground text-center py-8">No vouchers available</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
