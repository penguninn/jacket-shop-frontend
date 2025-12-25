import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface ChatMessage {
    id: number;
    userId: string;
    role: "user" | "ai" | "assistant";
    message: string;
    timestamp: string;
}

export interface ChatConversation {
    messages: ChatMessage[];
}

export interface SendMessageRequest {
    userId: string;
    message: string;
}

export interface SendMessageResponse {
    response: string;
}

const chatbotApi = {
    /**
     * Send a message to the chatbot and get a response
     * GET /api/chat?userId=xxx&message=xxx
     */
    sendMessage: async (
        userId: string,
        message: string
    ): Promise<string> => {
        const response = await axios.get(`${API_BASE_URL}/api/chat`, {
            params: {
                userId,
                message,
            },
            // Nếu backend trả về string thuần túy, axios đôi khi tự parse hoặc để nguyên
            responseType: 'text'
        });
        return response.data;
    },

    /**
     * Get chat history for the user
     * GET /api/chat/history?userId=xxx
     */
    getChatHistory: async (userId: string): Promise<ChatMessage[]> => {
        const response = await axios.get(`${API_BASE_URL}/api/chat/history`, {
            params: {
                userId,
            },
        });
        return response.data;
    },
};

export default chatbotApi;
