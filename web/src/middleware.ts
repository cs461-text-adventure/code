import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/get-session`, {
    method: "GET",
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });
  
  // if(!response.ok) {
  //   // TODO: Handle errors
  // }

  const data = await response.json();
  console.log("'data': {", data, "}", data === null);
  const loggedIn = (data != null)

  // Redirect to /signin the user is not authenticated and is accessing a protected route
  if (!loggedIn && !request.nextUrl.pathname.startsWith('/signin')) {
    // TODO: Set callback url to originally requested resource 
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (loggedIn && request.nextUrl.pathname.startsWith('/signin')) {
    return NextResponse.redirect(new URL('/forge', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/forge', '/signin', '/settings'],
};