import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/product/:path*',
    '/profile',
    '/profile/:path*',
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for BetterAuth session cookies
  const sessionCookie =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token') ||
    request.cookies.get('better-auth.session-token');

  if (!sessionCookie?.value) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    signInUrl.searchParams.set('authRequired', 'true');
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}
