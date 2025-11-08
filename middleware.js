import { NextResponse } from "next/server"

/**
 * Middleware Function
 * Runs on server-side before each page request
 * Protects routes by checking for authentication cookie
 * Redirects unauthenticated users to login page
 * 
 * @param {Request} request - The incoming HTTP request
 * @returns {NextResponse} - Response object (redirect or continue)
 */
export function middleware(request) {
  const { pathname } = request.nextUrl // Get the requested URL path

  // Allow API routes to pass through without authentication
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Allow login and signup pages to be accessed without authentication
  const publicPaths = ["/", "/signup"]
  if (publicPaths.includes(pathname)) {
    return NextResponse.next() // Continue to public page
  }

  // Check if authentication cookie exists
  const user = request.cookies.get("user")?.value

  // If no user cookie and not on a public page, redirect to login
  if (!user) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // User is authenticated, allow access to the requested page
  return NextResponse.next()
}

/**
 * Middleware Configuration
 * Specifies which routes the middleware should run on
 * Excludes static files, images, and favicon from auth checks
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
