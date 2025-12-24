import { useState, useRef, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ChatInputProps {
    onSend: (message: string) => Promise<void>;
    isLoading: boolean;
    disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading || disabled) return;

        const currentMessage = message;
        setMessage("");
        await onSend(currentMessage);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
        }
    }, [message]);

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-end gap-3 p-4 bg-white border-t border-gray-100"
        >
            <div className="flex-1 relative">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn của bạn..."
                    disabled={isLoading || disabled}
                    rows={1}
                    className={cn(
                        "w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm",
                        "placeholder:text-gray-400 focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20",
                        "transition-all duration-200 min-h-[48px] max-h-[150px]",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                />
            </div>

            <Button
                type="submit"
                disabled={!message.trim() || isLoading || disabled}
                className={cn(
                    "h-12 w-12 rounded-xl shrink-0",
                    "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
                    "shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40",
                    "transition-all duration-200 hover:scale-105",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                )}
            >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Send className="h-5 w-5" />
                )}
            </Button>
        </form>
    );
}
