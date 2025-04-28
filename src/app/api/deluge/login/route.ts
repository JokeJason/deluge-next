import { Deluge } from '@ctrl/deluge';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const deluge = new Deluge({ password });
    await deluge.login(); // Throws on bad password

    // Set HTTP-only, secure cookie with the password (or a session token)
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: 'deluge_pwd',
      value: password,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Auth failed' },
      { status: 401 },
    );
  }
}
