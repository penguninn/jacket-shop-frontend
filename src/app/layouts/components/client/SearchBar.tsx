import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchBar() {
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get("keyword") || "");
  const navigate = useNavigate();

  const handleSearch = (searchValue: string) => {
    const newParams = new URLSearchParams();
    if (searchValue) newParams.set("keyword", searchValue);
    navigate(`/search?${newParams.toString()}`);
  };

  return (
    <div className="hidden sm:flex items-center gap-2 rounded-md ring-1 ring-zinc-200 px-2 py-1 shadow-md bg-white">
      <Search className="w-4 h-4 text-zinc-500" />
      <input
        id="search"
        placeholder="Search..."
        className="text-sm outline-0 bg-transparent placeholder:text-zinc-400"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(value);
          }
        }}
      />
    </div>
  );
}
