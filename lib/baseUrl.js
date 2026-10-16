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
    return envBase.replace(/\/+$/, "");
  }

  // 2. Check proxy forwarding headers (Nginx, Cloudflare, AWS, PM2, etc.)
  if (req && req.headers) {
    const forwardedHost = req.headers.get("x-forwarded-host");
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";

    if (
      forwardedHost &&
      !forwardedHost.includes("0.0.0.0") &&
      !forwardedHost.includes("localhost") &&
      !forwardedHost.includes("127.0.0.1")
    ) {
      return `${forwardedProto}://${forwardedHost}`.replace(/\/+$/, "");
    }

    const host = req.headers.get("host");
    if (
      host &&
      !host.includes("0.0.0.0") &&
      !host.includes("localhost") &&
      !host.includes("127.0.0.1")
    ) {
      return `${forwardedProto}://${host}`.replace(/\/+$/, "");
    }
  }

  // 3. If running in production mode, default strictly to the live production domain
  if (process.env.NODE_ENV === "production") {
    return "https://drjhatka.com";
  }

  // 4. Fallback for local development
  return "http://localhost:3000";
}
