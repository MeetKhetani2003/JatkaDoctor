import { cookies } from "next/headers";

export async function verifyAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token");
    return token?.value === "authenticated_session_djm";
  } catch (e) {
    console.error("verifyAdmin failed:", e);
    return false;
  }
}
