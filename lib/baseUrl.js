/**
 * Helper to reliably get the public base URL of the application.
 * Prevents internal addresses like 0.0.0.0:3000 or localhost from leaking into production redirects and OAuth flows.
 */
export function getBaseUrl(req) {
  // 1. If explicit production URL is configured in environment
  const envBase = process.env.NEXT_PUBLIC_BASE_URL;
  if (
    envBase &&
    !envBase.includes("0.0.0.0") &&
    !envBase.includes("localhost") &&
    !envBase.includes("127.0.0.1")
  ) {
    return envBase.replace(/\/+$/, "").replace(/^https?:\/\/www\./i, "https://");
  }

  // 2. In production, always canonicalize to https://drjhatka.com to prevent redirect_uri mismatches with Google
  if (process.env.NODE_ENV === "production") {
    return "https://drjhatka.com";
  }

  // 3. Check proxy forwarding headers
  if (req && req.headers) {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    if (host && !host.includes("0.0.0.0") && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      const proto = req.headers.get("x-forwarded-proto") || "https";
      return `${proto}://${host.replace(/^www\./i, "")}`.replace(/\/+$/, "");
    }
  }

  // 4. Fallback for local development
  return "http://localhost:3000";
}
