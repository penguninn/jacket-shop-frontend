import { useState, useRef, useEffect } from "react";
import { useChatbot } from "../hooks/useChatbot";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { Button } from "@/shared/ui/button";
import { Bot, X, MessageCircle, Minimize2 } from "lucide-react";
import { useAuthStore, authStore } from "@/app/store/auth";
import { useNavigate } from "react-router-dom";
import { cn } from "@/shared/lib/utils";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const { messages, isLoading, error, sendMessage, fetchHistory } = useChatbot();
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = !!authStore.getAccess() && !!user;
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !isMinimized && isAuthenticated && user?.id) {
            fetchHistory(user.id.toString());
        }
    }, [isOpen, isMinimized, isAuthenticated, user?.id, fetchHistory]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading, isOpen, isMinimized]);

    const handleToggle = () => {
        if (isMinimized) {
            setIsMinimized(false);
        } else {
            setIsOpen(!isOpen);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={handleToggle}
                className={cn(
                    "fixed bottom-6 right-6 z-50",
                    "w-14 h-14 rounded-full",
                    "bg-gradient-to-br from-orange-500 to-orange-600",
                    "shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50",
                    "flex items-center justify-center",
                    "transition-all duration-300 hover:scale-110",
                    "group"
                )}
            >
                <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-25" />
            </button>
        );
    }

    if (isMinimized) {
        return (
            <div
                className={cn(
                    "fixed bottom-6 right-6 z-50",
                    "bg-gradient-to-r from-orange-500 to-orange-600 rounded-full",
                    "shadow-lg shadow-orange-500/30",
                    "flex items-center gap-2 px-4 py-3 cursor-pointer",
                    "transition-all duration-300 hover:shadow-orange-500/50"
                )}
                onClick={() => setIsMinimized(false)}
            >
                <Bot className="h-5 w-5 text-white" />
                <span className="text-white text-sm font-medium">Trợ lý AI</span>
                <div className="w-2 h-2 bg-green-400 rounded-full" />
            </div>
        );
    }

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 z-50",
                "w-[380px] h-[580px] max-h-[85vh]",
                "bg-white rounded-2xl shadow-2xl",
                "flex flex-col overflow-hidden",
                "border border-gray-100",
                "animate-in slide-in-from-bottom-5 fade-in duration-300",
                "chatbot-container"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-orange-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-sm">Trợ lý AI</h3>
                        <p className="text-xs text-white/80">Trực tuyến</p>
                    </div>
                </div>

                <div className="flex items-center gap-1 ml-auto">

                    <button
                        onClick={() => setIsMinimized(true)}
                        className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                        title="Thu nhỏ"
                    >
                        <Minimize2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                        title="Đóng"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {!isAuthenticated ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gray-50">
                    <div className="w-16 h-16 mb-4 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                        <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Đăng nhập để chat</h4>
                    <p className="text-sm text-gray-500 mb-6">Vui lòng đăng nhập để sử dụng tính năng này</p>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" onClick={() => navigate("/signup")}>Đăng ký</Button>
                        <Button size="sm" onClick={() => navigate("/signin")}>Đăng nhập</Button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Native Scrollable Area with Custom Class */}
                    <div className="flex-1 overflow-y-auto bg-gray-50/50 chatbot-messages-area">
                        <div className="flex flex-col min-h-full p-4">
                            {messages.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                                    <div className="w-14 h-14 mb-4 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                                        <Bot className="h-7 w-7 text-white" />
                                    </div>
                                    <h4 className="text-base font-semibold text-gray-800 mb-1">Xin chào! 👋</h4>
                                    <p className="text-sm text-gray-500 mb-6 px-8">Tôi có thể giúp gì cho bạn hôm nay?</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {["Xin chào", "Gợi ý"].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => sendMessage(s)}
                                                className="px-4 py-2 text-xs bg-white hover:bg-orange-500 hover:text-white text-gray-600 rounded-full border border-gray-200 hover:border-orange-500 transition-all font-medium shadow-sm"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((m) => (
                                        <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <ChatMessage message={m} />
                                        </div>
                                    ))}
                                    {isLoading && <TypingIndicator />}
                                    <div ref={messagesEndRef} className="h-2" />
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="px-3 py-2 bg-red-50 border-t border-red-100 flex-shrink-0">
                            <p className="text-[11px] text-red-600 text-center font-medium">{error}</p>
                        </div>
                    )}

                    <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
                        <ChatInput onSend={sendMessage} isLoading={isLoading} />
                    </div>
                </>
            )}
        </div>
    );
}
