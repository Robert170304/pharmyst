import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value;
  console.log("🚀 ~ middleware ~ token:", token);

  // Define protected routes (private routes)
  const protectedRoutes = ["/dashboard"];

  // Define auth routes (login, register, etc.)
  const publicRoutes = ["/auth/login", "/auth/register", "/auth/verify"];

  // Redirect /auth to /auth/login
  if (pathname === "/auth") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current path is an public route
  const isAuthRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing auth routes with token, redirect to dashboard
  if (isAuthRoute && token && !pathname.includes("dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
