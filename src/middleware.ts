import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const xProto = request.headers.get("x-forwarded-proto") || "http";
  const url = request.nextUrl;

  const hostWithoutPort = hostname.split(":")[0];
  const hostParts = hostWithoutPort.split(".");

  let subdomain: string | null = null;

  if (hostWithoutPort.includes("localhost")) {
    if (
      hostParts.length >= 2 &&
      hostParts[0] !== "localhost" &&
      hostParts[0] !== "www"
    ) {
      subdomain = hostParts[0];
    }
  } else {
    if (
      hostParts.length >= 3 &&
      hostParts[0] !== "www" &&
      hostParts[0] !== "dashboard"
    ) {
      subdomain = hostParts[0];
    }
  }

  const isPreviewMode = url.searchParams.get("preview") === "true";

  // --- Redirect from /locale/menu/slug → slug.domain.com only if NOT already on subdomain ---
  const menuPathMatch = url.pathname.match(/^\/[a-z]{2}\/menu\/([^/]+)/);
  if (menuPathMatch && !isPreviewMode) {
    const slug = menuPathMatch[1];
    if (!hostname.startsWith(slug + ".")) {
      const protocol = xProto;
      const baseHost = hostWithoutPort.includes("localhost")
        ? "localhost"
        : hostWithoutPort.split(".").slice(-2).join(".");
      const queryString = url.search;
      return NextResponse.redirect(
        `${protocol}://${slug}.${baseHost}${queryString}`
      );
    }
  }

  // --- Rewrite for subdomains ---
  if (subdomain) {
    let locale = "ar";
    if (url.pathname.startsWith("/en")) locale = "en";
    else if (url.pathname.startsWith("/ar")) locale = "ar";

    const expectedMenuPath = `/${locale}/menu/${subdomain}`;

    // Only rewrite if not already on expected path
    if (url.pathname !== expectedMenuPath) {
      if (
        url.pathname.startsWith("/api") ||
        url.pathname.startsWith("/_next") ||
        url.pathname.startsWith("/images") ||
        url.pathname.startsWith("/uploads")
      ) {
        return NextResponse.next();
      }

      return NextResponse.rewrite(new URL(expectedMenuPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|uploads).*)"],
};
