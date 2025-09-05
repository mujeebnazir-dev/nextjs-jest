import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const url = req.nextUrl.clone();

  // if not logged in and trying to access protected route
  if (!token && url.pathname.startsWith("/app/home")) {
    url.pathname = "/app/auth";
    return NextResponse.redirect(url);
  }

  // if logged in and visiting root
  if (token && url.pathname === "/") {
    url.pathname = "/app/home";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/app/:path*"],
};
