import { NextResponse } from "next/server"

// Middleware for future use
export function middleware(request) {
  const response = NextResponse.next();
  const { pathname, searchParams } = new URL(request.url);

  if (pathname === "/pulse") {
    // Video ID to Dynamic
    if (searchParams.has("id")) {
      const id = searchParams.get("id");
      return NextResponse.redirect(new URL(`/pulse/${id}`, request.url));
    }
  }
  
  if (pathname === "/flare") {
    // Video ID to Dynamic
    if (searchParams.has("id")) {
      const id = searchParams.get("id");
      return NextResponse.redirect(new URL(`/flare/${id}`, request.url));
    }
  }
  
  return response;
}