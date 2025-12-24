import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Bot } from "lucide-react";

export function TypingIndicator() {
    return (
        <div className="flex items-start gap-3 py-4 px-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            {/* Avatar */}
            <Avatar className="h-9 w-9 shrink-0 bg-gradient-to-br from-slate-700 to-slate-900 ring-2 ring-offset-2 ring-offset-background ring-slate-500/30 shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                    <Bot className="h-4 w-4" />
                </AvatarFallback>
            </Avatar>

            {/* Typing bubble */}
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md">
                <div className="flex items-center gap-1">
                    <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                    />
                    <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                    />
                    <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                    />
                </div>
            </div>
        </div>
    );
}
