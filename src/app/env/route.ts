import { NextResponse } from 'next/server';

// TODO: remove this when not needed
export async function GET(): Promise<NextResponse> {
  // return environment variables
  const env = {
    DELUGE_NEXT_BASE_URL: process.env.DELUGE_NEXT_BASE_URL,
    DELUGE_URL: process.env.DELUGE_URL,
    DELUGE_PASSWORD: process.env.DELUGE_PASSWORD,
    DELUGE_TIMEOUT: process.env.DELUGE_TIMEOUT,
  };

  return NextResponse.json({ success: true, env });
}
