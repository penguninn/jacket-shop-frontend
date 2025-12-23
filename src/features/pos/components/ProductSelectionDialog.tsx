import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui/dialog";
import { Plus } from "lucide-react";
import { ProductSearch } from "./ProductSearch";
import { useState } from "react";

export function ProductSelectionDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full h-12 text-lg" variant="secondary">
                    <Plus className="mr-2 h-5 w-5" />
                    Select Products
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-[85vw] h-[85vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>Select Products</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto min-h-0">
                    <ProductSearch />
                </div>
            </DialogContent>
        </Dialog>
    );
}
