import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnOnboarding = req.nextUrl.pathname.startsWith("/onboarding");

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (isOnOnboarding && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
