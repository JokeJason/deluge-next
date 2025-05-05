import { validateSession } from '@/app/actions/auth';
import { Deluge } from '@ctrl/deluge';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

const deluge = new Deluge({
  baseUrl: process.env.DELUGE_URL,
  password: process.env.DELUGE_PASSWORD,
  timeout: process.env.DELUGE_TIMEOUT
    ? Number(process.env.DELUGE_TIMEOUT)
    : undefined,
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { authenticated } = await validateSession();
  if (!authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

  const url = new URL(request.url);
  const filter: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    filter[key] = value;
  });

  try {
    // Ensure authenticated session and fetch all torrent data
    const data = await deluge.listTorrents([], filter);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
