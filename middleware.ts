// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Try to get the token from cookies
  const token = request.cookies.get("token")?.value;

  // If user tries to access /portfolio or any nested route inside /portfolio
  // but there is no token, redirect them to homepage "/"
  if (request.nextUrl.pathname.startsWith("/portfolio") && !token) {
    // Redirect to homepage
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Otherwise, allow request to proceed
  return NextResponse.next();
}

// Protect /portfolio and all nested routes
export const config = {
  matcher: ["/portfolio/:path*"],
};
