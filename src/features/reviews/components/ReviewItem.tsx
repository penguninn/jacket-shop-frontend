import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import type { ReviewResponse } from "../model/types";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/shared/lib/utils";

interface ReviewItemProps {
    review: ReviewResponse;
}

export function ReviewItem({ review }: ReviewItemProps) {
    const userName = review.userName || "Anonymous";
    const initials = userName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const rating = review.rating ?? 0;

    // Handle date parsing safely. If it's an array (Java serialization), handle or fallback.
    // For now assuming string or standard date constructable.
    // Handle date parsing safely.
    let dateObj: Date | null = null;
    try {
        if (review.createdAt) {
            if (Array.isArray(review.createdAt)) {
                // Handle Java serialization [yyyy, MM, dd, HH, mm, ss, nnn]
                // Note: Month is 0-indexed in JS Date, but usually 1-indexed in Java arrays.
                // Need to check if user backend returns typical array.
                // Assuming standard ISO string is preferred, but if array:
                const [year, month, day, hour, minute, second] = review.createdAt as number[];
                dateObj = new Date(year, month - 1, day, hour, minute, second);
            } else {
                dateObj = new Date(review.createdAt as string | number);
            }
        }
    } catch (e) {
        console.error("Invalid date:", review.createdAt);
    }

    return (
        <div className="border-b border-gray-100 py-8 last:border-0">
            <div className="flex gap-4">
                <Avatar className="w-12 h-12">
                    <AvatarImage src="" alt={userName} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-gray-900">{userName}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex text-[#FFC633]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn("w-4 h-4 fill-current", i < rating ? "text-[#FFC633]" : "text-gray-200")}
                                            strokeWidth={0}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <span className="text-gray-400 text-sm">
                            {dateObj ? format(dateObj, "MMMM d, yyyy") : ""}
                        </span>
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                        {review.comment}
                    </p>
                </div>
            </div>
        </div>
    );
}
