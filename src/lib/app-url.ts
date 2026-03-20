import { env } from "@/lib/env";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function sanitizePublicHttpsUrl(maybeUrl: string): string | null {
  const trimmed = stripTrailingSlash(maybeUrl.trim());
  if (!trimmed) return null;

  // Allow configs like `example.com` by assuming https.
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const u = new URL(withScheme);
    // Telegram inline keyboard URLs must be publicly reachable. Avoid localhost.
    if (u.protocol !== "https:") return null;
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return null;
    return stripTrailingSlash(u.toString());
  } catch {
    return null;
  }
}

/**
 * Public origin for staff-facing links (e.g. Telegram channel → admin application).
 * Order: NEXT_PUBLIC_APP_URL, BETTER_AUTH_URL (same app in many setups), then VERCEL_URL.
 */
export function resolvePublicAppBaseUrl(): string | null {
  const app = env.NEXT_PUBLIC_APP_URL?.trim();
  if (app) {
    return sanitizePublicHttpsUrl(app);
  }
  const authBase = env.BETTER_AUTH_URL?.trim();
  if (authBase) {
    return sanitizePublicHttpsUrl(authBase);
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//i, "").split("/")[0] ?? "";
    if (host) {
      return stripTrailingSlash(`https://${host}`);
    }
  }
  return null;
}
