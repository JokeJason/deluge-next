import 'server-only';

import { prisma } from '@/lib/db';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

interface SessionPayload {
  sessionId: number;
  expiresAt: string;
  [key: string]: unknown;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(new Date(payload.expiresAt))
    .sign(encodedKey);
}

export async function decrypt(token?: string) {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.error('Session decryption error:', error);
    return null;
  }
}

export async function createSession() {
  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const session = await prisma.session.create({
    data: { expiresAt: new Date(expiresAt) },
  });

  const token = await encrypt({ sessionId: session.id, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set('deluge-next-session', token, {
    httpOnly: true,
    secure: true,
    expires: new Date(expiresAt),
    path: '/',
  });
}

export async function deleteSession(token?: string) {
  const payload = await decrypt(token);
  if (payload?.sessionId) {
    await prisma.session.delete({ where: { id: payload.sessionId } });
  }
  const cookieStore = await cookies();
  cookieStore.delete('deluge-next-session');
}
