import { NextResponse } from "next/server"

// Middleware for future use
export function middleware(request) {
  const { pathname, searchParams } = new URL(request.url);
  return NextResponse.next();
}