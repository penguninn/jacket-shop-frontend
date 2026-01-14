import { ProductSearchTable } from "./ProductSearchTable";
import type { Order } from "../model/schemas";

interface ProductSearchProps {
    activeDraft: Order | undefined;
}

export function ProductSearch({ activeDraft }: ProductSearchProps) {
    return (
        <div className="w-full flex flex-col h-full bg-background rounded-b-lg">
            <div className="flex-1 overflow-hidden bg-background flex flex-col p-0">
                <ProductSearchTable activeDraft={activeDraft} />
            </div>
        </div>
    );
}