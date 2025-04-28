import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;
  // // Allow unauthenticated access to /login and static assets
  // if (pathname.startsWith('/login') || pathname.startsWith('/api/login')) {
  //   return NextResponse.next();
  // }
  // // Check for our auth cookie
  // const pwd = request.cookies.get('deluge_pwd')?.value;
  // if (!pwd) {
  //   // Redirect to login
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  // return NextResponse.next();
}

// Apply to all routes except /_next, /favicon.ico, etc.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
