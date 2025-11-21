import { getRoles } from "../api";
import { useQuery } from "@tanstack/react-query";

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
}
