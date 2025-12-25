import { useRef, useEffect } from "react";
import { useChatbot } from "../hooks/useChatbot";
import { ChatMessage } from "../components/ChatMessage";
import { ChatInput } from "../components/ChatInput";
import { TypingIndicator } from "../components/TypingIndicator";
import { EmptyState } from "../components/EmptyState";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Button } from "@/shared/ui/button";
import { Bot, Trash2, ArrowLeft, MessageCircle } from "lucide-react";
import { useAuthStore } from "@/app/store/auth";
import { Link, useNavigate } from "react-router-dom";

export default function ChatbotPage() {
    const { messages, isLoading, error, sendMessage, clearHistory } = useChatbot();
    const accessToken = useAuthStore((state) => state.accessToken);
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = !!accessToken && !!user;
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // If not authenticated, show login prompt
    if (!isAuthenticated) {
        return (
            <div className="min-h-[calc(100vh-140px)] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <MessageCircle className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        Đăng nhập để chat
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Vui lòng đăng nhập để sử dụng tính năng chat với trợ lý AI của chúng tôi.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/signup")}
                            className="px-6"
                        >
                            Đăng ký
                        </Button>
                        <Button
                            onClick={() => navigate("/signin")}
                            className="px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                        >
                            Đăng nhập
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-140px)] bg-gradient-to-br from-gray-50 via-gray-50 to-orange-50/30">
            <div className="container mx-auto px-4 py-6 h-[calc(100vh-140px)] flex flex-col">
                {/* Chat Container */}
                <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-100">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/50">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </Link>

                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                                        <Bot className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                </div>
                                <div>
                                    <h1 className="font-semibold text-gray-800">Trợ lý AI</h1>
                                    <p className="text-xs text-green-600 font-medium">Đang hoạt động</p>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearHistory}
                            disabled={messages.length === 0}
                            className="text-gray-500 hover:text-red-500 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa lịch sử
                        </Button>
                    </div>

                    {/* Messages Area */}
                    <ScrollArea className="flex-1">
                        <div className="min-h-full">
                            {messages.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <div className="py-2">
                                    {messages.map((message) => (
                                        <ChatMessage key={message.id} message={message} />
                                    ))}
                                    {isLoading && <TypingIndicator />}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Error Message */}
                    {error && (
                        <div className="px-4 py-2 bg-red-50 border-t border-red-100">
                            <p className="text-sm text-red-600 text-center">{error}</p>
                        </div>
                    )}

                    {/* Input Area */}
                    <ChatInput onSend={sendMessage} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}
