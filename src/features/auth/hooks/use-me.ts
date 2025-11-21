import { getMe } from "../api/me";
import { useQuery } from "@tanstack/react-query";

export function useMe() {
    return useQuery({
        queryKey: ["me"],
        queryFn: getMe,
    });
}
