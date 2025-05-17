import { decrypt } from '@/lib/session';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Define interface for session data
interface SessionData {
  sessionId: number;
  expiresAt: string;
}

// Define route configurations
const ROUTES = {
  protected: ['/list'],
  public: ['/login'],
};

/**
 * Basic token validation without database checks
 */
async function validateToken(
  token: string | undefined,
): Promise<SessionData | null> {
  if (!token) return null;

  try {
    const session = (await decrypt(token)) as SessionData;

    // Check basic session validity
    if (!session?.sessionId || !session?.expiresAt) {
      return null;
    }

    // Check if session is expired
    if (new Date(session.expiresAt) <= new Date()) {
      return null;
    }

    return session;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = ROUTES.protected.includes(path);

  // Get token from cookies
  const token = req.cookies.get('deluge-next-session')?.value;
  const session = await validateToken(token);

  // Handle protected routes - redirect to login if no valid token
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/list', '/login'],
};
