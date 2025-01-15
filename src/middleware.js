import { NextResponse } from "next/server"

// Middleware for future use
export function middleware(request) {
  const { pathname, searchParams } = new URL(request.url);
  
  if (pathname === '/video' && searchParams.has('id')) {
    const response = NextResponse.next()
    
    // Prevent caching for dynamic video pages
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    response.headers.set('CDN-Cache-Control', 'no-store')
    response.headers.set('Cloudflare-CDN-Cache-Control', 'no-store')
    
    // Add Vary header to differentiate cached responses
    response.headers.set('Vary', 'Accept-Encoding, x-forwarded-for')
    
    return response
  }
  
  return NextResponse.next();
}