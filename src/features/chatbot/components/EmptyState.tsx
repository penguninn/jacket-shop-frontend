import { Bot, Sparkles } from "lucide-react";

export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
            {/* Animated Bot Icon */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/30">
                    <Bot className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg animate-bounce">
                    <Sparkles className="h-4 w-4 text-white" />
                </div>
            </div>

            {/* Welcome Text */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Xin chào! Tôi là trợ lý AI
            </h2>
            <p className="text-gray-500 max-w-md leading-relaxed mb-8">
                Tôi có thể giúp bạn tìm kiếm sản phẩm, trả lời câu hỏi về đơn hàng,
                hoặc tư vấn về các sản phẩm áo khoác phù hợp với bạn.
            </p>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {[
                    "Tìm áo khoác nam",
                    "Đơn hàng của tôi",
                    "Mã giảm giá",
                    "Chính sách đổi trả",
                ].map((suggestion) => (
                    <span
                        key={suggestion}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full cursor-pointer transition-colors duration-200"
                    >
                        {suggestion}
                    </span>
                ))}
            </div>
        </div>
    );
}
