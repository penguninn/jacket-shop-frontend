import { AppProvider } from "@/app/providers/AppProvider";
import { routes } from "@/app/routes/AppRoutes";
import { useRoutes } from "react-router-dom";

const AppRoutes = () => useRoutes(routes);

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
