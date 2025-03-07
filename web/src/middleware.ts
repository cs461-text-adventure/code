import { NextRequest, NextResponse } from "next/server";

export default async function authMiddleware(request: NextRequest) {
  // Check for session cookie
  const sessionCookie = request.cookies.get('session');
  let data = null;

  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(sessionCookie.value);
      if (session?.user?.id) {
        data = {
          user: session.user
        };
      }
    } catch (e) {
      console.error('Error parsing session cookie:', e);
    }
  }

  const response = NextResponse.next();

  // If the user is not authenticated and not on login or signup page
  if (
    !data &&
    request.nextUrl.pathname != "/login" &&
    request.nextUrl.pathname != "/signup"
  ) {
    const loginUrl = new URL("/login", request.url);
    // Set callbackURL to the requested protected path
    const callbackURL = request.nextUrl.pathname;
    loginUrl.searchParams.set("callbackURL", callbackURL);
    // Redirect to the login page
    return NextResponse.redirect(loginUrl);
  }

  // If the user is authenticated and on the login or signup page
  if (
    data != null &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup")
  ) {
    // Redirect to the original request URL or a default
    const redirectUrl =
      request.nextUrl.searchParams.get("callbackURL") ?? "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard"],
};
