import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/baseUrl";

export async function GET(req) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const base = getBaseUrl(req);
  const redirectUri = `${base}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}
