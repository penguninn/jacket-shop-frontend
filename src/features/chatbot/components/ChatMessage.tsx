import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Bot, User } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "../api/chatbot-api";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
    message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <div
            className={cn(
                "flex items-start gap-3 py-4 px-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar */}
            <Avatar
                className={cn(
                    "h-9 w-9 shrink-0 ring-2 ring-offset-2 ring-offset-background shadow-lg",
                    isUser
                        ? "bg-gradient-to-br from-orange-500 to-orange-600 ring-orange-500/30"
                        : "bg-gradient-to-br from-slate-700 to-slate-900 ring-slate-500/30"
                )}
            >
                <AvatarFallback
                    className={cn(
                        "text-white",
                        isUser
                            ? "bg-gradient-to-br from-orange-500 to-orange-600"
                            : "bg-gradient-to-br from-slate-700 to-slate-900"
                    )}
                >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </AvatarFallback>
            </Avatar>

            {/* Message Bubble */}
            <div
                className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3 shadow-md",
                    isUser
                        ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-tr-sm"
                        : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                )}
            >
                <div
                    className={cn(
                        "text-sm leading-relaxed",
                        isUser ? "text-white" : "text-gray-700"
                    )}
                >
                    {isUser ? (
                        <p className="whitespace-pre-wrap">{message.message}</p>
                    ) : (
                        <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-headings:my-2 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5">
                            <ReactMarkdown>{message.message}</ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Timestamp */}
                <div
                    className={cn(
                        "text-[10px] mt-2 opacity-70",
                        isUser ? "text-white/80 text-right" : "text-gray-400"
                    )}
                >
                    {new Date(message.timestamp).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </div>
            </div>
        </div>
    );
}
