import Footer from "./components/client/Footer";
import Navbar from "./components/client/Navbar";
import { Outlet } from "react-router-dom";
import { ChatWidget } from "@/features/chatbot";

export default function ClientLayout() {
  return (
    <div className="mx-auto w-full">
      <Navbar />
      <Outlet />
      <Footer />
      <ChatWidget />
    </div>
  );
}
