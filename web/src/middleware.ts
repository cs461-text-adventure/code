import { NextRequest, NextResponse } from "next/server";

export default async function authMiddleware(request: NextRequest) {
  // Validate the access token
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/auth/get-session";
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });
  const data = await response.json();

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard"],
};
