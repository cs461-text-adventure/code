import { NextRequest, NextResponse } from "next/server";

export default async function authMiddleware(request: NextRequest) {
  // Check for login attempt with test credentials
  let data = null;
  
  if (request.nextUrl.pathname === '/login' && request.method === 'POST') {
    try {
      const body = await request.json();
      if (body.email === 'test@example.com' && body.password === 'password123') {
        data = {
          user: {
            id: "dev-user-123",
            name: "Test User",
            email: "test@example.com",
            emailVerified: true,
          }
        };
      }
    } catch {
      // Ignore JSON parse errors
    }
  }

  // Check for mock session cookie
  const mockSession = request.cookies.get('mock-session');
  if (mockSession?.value === 'test-user') {
    data = {
      user: {
        id: "dev-user-123",
        name: "Test User",
        email: "test@example.com",
        emailVerified: true,
      }
    };
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
