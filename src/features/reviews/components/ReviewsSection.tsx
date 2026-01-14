import { useState, useMemo } from "react";
import { useReviewsByProduct } from "../hooks";
import { ReviewItem } from "./ReviewItem";
import { CreateReviewModal } from "./CreateReviewModal";
import { Button } from "@/shared/ui/button";
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { useAuthStore } from "@/app/store/auth";
import { useMyOrders } from "@/features/orders/hooks";
import { ORDER_STATUS } from "@/features/orders/model/schemas";
import type { SortDirection } from "@/shared/api/schemas";

interface ReviewsSectionProps {
    productId: number;
    ratingCount?: number;
}

export function ReviewsSection({ productId, ratingCount }: ReviewsSectionProps) {
    const [page, setPage] = useState(0);
    const [sortBy, setSortBy] = useState("");

    const { data, isLoading } = useReviewsByProduct(productId, {
        page,
        size: 5,
        sortBy: sortBy.split("_")[0],
        sortDir: sortBy.split("_")[1] as SortDirection,
    });

    const reviews = data?.contents || [];
    const totalPages = data?.totalPages || 0;

    // --- Order Eligibility Logic ---
    const { user } = useAuthStore();
    const isAuthenticated = !!user;

    // Fetch orders to check eligibility
    // We only check confirmed/completed orders
    const { data: myOrders } = useMyOrders(ORDER_STATUS.COMPLETED);

    // Find if user has purchased this product
    const validOrder = useMemo(() => {
        if (!myOrders || !isAuthenticated) return null;

        // Find latest order containing this product
        return myOrders.find(order =>
            order.details?.some(detail => detail.productId === productId)
        );
    }, [myOrders, productId, isAuthenticated]);

    return (
        <div className="pt-8 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    All Reviews
                    <span className="text-base font-normal text-gray-400">({ratingCount || data?.totalElements || 0})</span>
                </h3>
                <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px] rounded-full bg-[#F0F0F0] border-none">
                            <SelectValue placeholder="Latest" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="createdAt_desc">Latest</SelectItem>
                            <SelectItem value="createdAt_asc">Oldest</SelectItem>
                        </SelectContent>
                    </Select>

                    {validOrder ? (
                        <CreateReviewModal
                            productId={productId}
                            orderId={validOrder.id}
                            trigger={
                                <Button className="rounded-full bg-black text-white hover:bg-black/90 px-6">
                                    Write a Review
                                </Button>
                            }
                        />
                    ) : (
                        isAuthenticated && (
                            <div className="text-sm text-gray-500 italic px-4">
                                Buy to review
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-xl font-medium text-gray-900 mb-2">No reviews yet</p>
                    <p>Be the first to share your thoughts!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <ReviewItem key={review.id} review={review} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4 font-medium text-sm">
                        Page {page + 1} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
