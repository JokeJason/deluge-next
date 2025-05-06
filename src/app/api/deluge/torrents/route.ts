import { validateSession } from '@/app/actions/auth';
import { getDelugeClient } from '@/lib/deluge-client';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { authenticated } = await validateSession();
  if (!authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

  const deluge = await getDelugeClient();
  if (!deluge) {
    return NextResponse.json(
      { success: false, error: 'Deluge client not initialized' },
      { status: 500 },
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
