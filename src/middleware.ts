import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnOnboarding = req.nextUrl.pathname.startsWith("/onboarding");
  const isCompletingOnboarding =
    req.nextUrl.pathname === "/onboarding/complete";

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Allow /onboarding/complete for authenticated users
  if (isOnOnboarding && isLoggedIn && !isCompletingOnboarding) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
