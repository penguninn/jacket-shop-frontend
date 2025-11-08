import { BrowserRouter, useRoutes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { routes } from "@/routes/AppRoutes";

const AppRoutes = () => useRoutes(routes);

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
