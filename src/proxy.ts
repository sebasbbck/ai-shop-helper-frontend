import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/recover-password",
  "/verify-email",
  "/reset-password",
  "/connection",
  "/billing/return",
];

const isPublicRoute = (pathname: string): boolean =>
  PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has("refresh_token");
  const publicRoute = isPublicRoute(pathname);

  if (!hasSession && !publicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\.).*)"],
};
