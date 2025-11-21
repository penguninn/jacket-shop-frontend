import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="rounded-3xl bg-gray-100 px-10 py-16 shadow-sm max-w-lg">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-black p-5">
            <SearchX className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          404 - Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link to="/">
          <Button className="rounded-full px-8 py-6 text-base font-medium">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
