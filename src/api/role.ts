import { httpPrivateTyped } from "@/lib/api/http-typed";
import z from "zod";

export async function getRoles() {
  const roleSchema = z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  );
  const res = await httpPrivateTyped.get("/roles", roleSchema);
  return res;
}
