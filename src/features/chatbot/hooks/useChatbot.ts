import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import chatbotApi, { type ChatMessage } from '../api/chatbot-api';
import { useAuthStore } from '@/app/store/auth';

interface ChatbotState {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    sendMessage: (text: string) => Promise<void>;
    fetchHistory: (userId: string) => Promise<void>;
    clearHistory: () => void;
    setMessages: (messages: ChatMessage[]) => void;
}

export const useChatbot = create<ChatbotState>()(
    persist(
        (set) => ({
            messages: [],
            isLoading: false,
            error: null,

            setMessages: (messages) => set({ messages }),

            fetchHistory: async (userId: string) => {
                set({ isLoading: true });
                try {
                    const history = await chatbotApi.getChatHistory(userId);
                    set({ messages: history, isLoading: false });
                } catch (err: unknown) {
                    console.error("Fetch history error:", err);
                    set({ isLoading: false });
                }
            },

            sendMessage: async (text: string) => {
                const user = useAuthStore.getState().user;
                const userId = user?.id?.toString() || "guest";

                // Add user message immediately
                const userMessage: ChatMessage = {
                    id: Date.now(),
                    userId,
                    role: "user",
                    message: text,
                    timestamp: new Date().toISOString(),
                };

                set((state) => ({
                    messages: [...state.messages, userMessage],
                    isLoading: true,
                    error: null,
                }));

                try {
                    const responseText = await chatbotApi.sendMessage(userId, text);

                    const assistantMessage: ChatMessage = {
                        id: Date.now() + 1,
                        userId: "ai",
                        role: "ai",
                        message: responseText,
                        timestamp: new Date().toISOString(),
                    };

                    set((state) => ({
                        messages: [...state.messages, assistantMessage],
                        isLoading: false,
                    }));
                } catch (err: unknown) {
                    console.error("Chat error:", err);
                    let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại sau.";
                    if (err && typeof err === 'object' && 'response' in err) {
                        const axiosError = err as any;
                        // Nếu backend trả về JSON lỗi trong text response
                        if (typeof axiosError.response?.data === 'string') {
                            try {
                                const errorData = JSON.parse(axiosError.response.data);
                                errorMessage = errorData.message || errorMessage;
                            } catch {
                                errorMessage = `Backend Error: ${axiosError.response.status}`;
                            }
                        } else {
                            errorMessage = axiosError.response?.data?.message || errorMessage;
                        }
                    }
                    set({
                        isLoading: false,
                        error: errorMessage,
                    });
                }
            },

            clearHistory: () => set({ messages: [], error: null }),
        }),
        {
            name: 'chatbot-storage',
            partialize: (state) => ({ messages: state.messages }),
        }
    )
);
