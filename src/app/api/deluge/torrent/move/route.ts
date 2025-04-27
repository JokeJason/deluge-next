import { Deluge } from '@ctrl/deluge';
import { NextResponse } from 'next/server';

const deluge = new Deluge({
  baseUrl: process.env.DELUGE_URL,
  password: process.env.DELUGE_PASSWORD,
  timeout: process.env.DELUGE_TIMEOUT
    ? Number(process.env.DELUGE_TIMEOUT)
    : undefined,
});

// NEXT.js route handler PUT endpoint to move download location
export async function PUT(request: Request) {
  try {
    const { torrentId, path } = await request.json();

    const result = await deluge.setTorrentOptions(torrentId, {
      move_completed_path: path,
    });
    return NextResponse.json({ success: true, result: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
