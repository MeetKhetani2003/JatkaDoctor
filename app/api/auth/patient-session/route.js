import { NextResponse } from "next/server";

export async function GET(req) {
  const cookie = req.cookies.get("patient_session");
  if (!cookie) {
    return NextResponse.json({ loggedIn: false, patient: null });
  }

  try {
    const decoded = JSON.parse(Buffer.from(cookie.value, "base64").toString("utf-8"));
    return NextResponse.json({ loggedIn: true, patient: decoded });
  } catch {
    return NextResponse.json({ loggedIn: false, patient: null });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set("patient_session", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
