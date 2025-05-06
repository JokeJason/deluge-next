import { getDelugeClient } from '@/lib/deluge-client';
import { NextResponse } from 'next/server';
import 'server-only';

export async function GET() {
  const deluge = await getDelugeClient();
  if (!deluge) {
    return NextResponse.json(
      { success: false, error: 'Deluge client not available' },
      { status: 500 },
    );
  }

  try {
    // Ensure authenticated session and fetch all torrent data
    const data = await deluge.getHosts();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
