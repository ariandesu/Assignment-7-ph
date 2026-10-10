import { NextRequest, NextResponse } from 'next/server';
import { createMiddleware } from 'better-auth/next';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};

// Middleware for protected routes
export async function middleware(request: NextRequest) {
  // TODO: Implement actual BetterAuth middleware
  // This would check session and redirect if needed
  
  // For now, just pass through
  return NextResponse.next();
}