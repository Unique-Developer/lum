import { headers } from "next/headers";
import { verifyToken } from "./auth";

export async function requireAdmin(): Promise<{ email: string } | null> {
  const headersList = await headers();
  const auth = headersList.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const payload = await verifyToken(token);
  return payload ? { email: payload.sub } : null;
}
