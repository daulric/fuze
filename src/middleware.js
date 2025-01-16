import { NextResponse } from "next/server"

// Middleware for future use
export function middleware(request) {
  const { pathname, searchParams } = new URL(request.url);
  
  if (pathname === "/video") {
    
    // Video ID to Dynamic
    if (searchParams.has("id")) {
      let id = searchParams.get("id");
      return NextResponse.redirect(new URL(`/video/${id}`, request.url));
    }
  }
  
  return NextResponse.next();
}