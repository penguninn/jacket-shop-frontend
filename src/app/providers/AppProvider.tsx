import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "@/shared/api/query-client";

interface AppProviderProps {
    children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
