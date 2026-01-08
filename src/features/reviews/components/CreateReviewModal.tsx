import { useState } from "react";
import { useCreateReview } from "../hooks";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

interface CreateReviewModalProps {
    productId: number;
    trigger?: React.ReactNode;
}

export function CreateReviewModal({ productId, trigger }: CreateReviewModalProps) {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);

    const { mutate: createReview, isPending } = useCreateReview();

    const handleSubmit = () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        createReview({
            productId,
            rating,
            comment
        }, {
            onSuccess: () => {
                setOpen(false);
                setComment("");
                setRating(5);
                // Notification handled by hook, but can add specific actions here
            },
            onError: (err: any) => {
                // Error handled by global hook usually, but safe to log
                console.error(err);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Write a Review</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                        Share your thoughts about this product with other customers.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    <Star
                                        className={cn(
                                            "w-8 h-8",
                                            (hoverRating || rating) >= star
                                                ? "fill-[#FFC633] text-[#FFC633]"
                                                : "text-gray-300"
                                        )}
                                        strokeWidth={1}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">Comment</Label>
                        <Textarea
                            id="comment"
                            placeholder="Tell us what you liked or disliked..."
                            className="min-h-[120px] resize-none"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={800}
                        />
                        <div className="text-xs text-right text-gray-400">
                            {comment.length}/800
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? "Submitting..." : "Submit Review"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
