import { NextResponse } from "next/server"

// Middleware for future use
export function middleware(request) {
  const response = NextResponse.next();
  const { pathname, searchParams } = new URL(request.url);

  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Surrogate-Control", "no-store")
  
  if (pathname === "/video") {
    // Video ID to Dynamic
    if (searchParams.has("id")) {
      let id = searchParams.get("id");
      return NextResponse.redirect(new URL(`/video/${id}`, request.url));
    }
  }
  
  return response;
}