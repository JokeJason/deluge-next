import { getDelugeClient } from '@/lib/deluge-client';
import { ApiResponse } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<ApiResponse<string[]>>> {
  const deluge = await getDelugeClient();
  if (!deluge) {
    return NextResponse.json(
      { success: false, error: 'Deluge client not initialized' },
      { status: 500 },
    );
  }

  try {
    // Ensure authenticated session and fetch all torrent data
    const data = await deluge.listTorrents([], { state: 'state' });
    const states = data.result ? data.result.filters.state : [];
    // get all strings from the states array
    const statesArray = states.map((s) => s[0]);

    return NextResponse.json({
      success: true,
      data: statesArray,
    } as ApiResponse<string[]>);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
