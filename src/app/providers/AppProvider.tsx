import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "@/shared/api/query-client";
import { Toaster } from "@/shared/ui/sonner";
import { SessionExpiredListener } from "./SessionExpiredListener";

interface AppProviderProps {
    children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                <BrowserRouter>
                    <SessionExpiredListener />
                    {children}
                    <Toaster
                        position="top-right"
                        richColors
                        closeButton
                        duration={4000}
                        toastOptions={{
                            classNames: {
                                error: 'bg-red-50 border-red-200',
                                success: 'bg-green-50 border-green-200',
                                warning: 'bg-yellow-50 border-yellow-200',
                                info: 'bg-blue-50 border-blue-200',
                            },
                        }}
                    />
                </BrowserRouter>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
