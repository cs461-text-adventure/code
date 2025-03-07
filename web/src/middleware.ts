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
  // TODO: IF RESPONSE NOT OK

  // Check if user is authenticated (response was returned using STRING 'null')
  const responseText = await response.text();
  const authenticated = responseText.length > 0 && responseText != "null";

  // If the user is not authenticated and not on login or signup page
  if (
    !authenticated &&
    !["/login", "/signup"].includes(request.nextUrl.pathname)
  ) {
    const loginUrl = new URL("/login", request.url);
    const callbackURL = request.nextUrl.pathname;
    loginUrl.searchParams.set("callbackURL", callbackURL); // Set callback URL
    return NextResponse.redirect(loginUrl); // Redirect to login
  }

  // If the user is authenticated and on the login or signup page, redirect to dashboard or callback URL
  if (
    authenticated &&
    ["/login", "/signup"].includes(request.nextUrl.pathname)
  ) {
    const redirectUrl =
      request.nextUrl.searchParams.get("callbackURL") ?? "/dashboard"; // Default to /dashboard if no callback
    return NextResponse.redirect(new URL(redirectUrl, request.url)); // Redirect to dashboard or callback URL
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard"],
};
