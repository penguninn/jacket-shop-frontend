export default function PurchasePage() {
    return (
        <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden">
            <div className="border-b px-6 py-4">
                <h2 className="text-lg font-medium">My Purchases</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    View and track your order history
                </p>
            </div>
            <div className="flex-1 p-6">
                <div className="bg-muted/50 rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">You haven't made any purchases yet.</p>
                </div>
            </div>
        </div>
    );
}
