import { Deluge } from '@ctrl/deluge';
import { NextResponse } from 'next/server';

const deluge = new Deluge({
  baseUrl: process.env.DELUGE_URL,
  password: process.env.DELUGE_PASSWORD,
});

export async function GET(request: Request) {
  try {
    // Ensure authenticated session and fetch all torrent data
    const data = await deluge.getAllData();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { torrent, options } = await request.json();
    // Supports magnet links or uploaded .torrent content
    const result = await deluge.normalizedAddTorrent(torrent, options);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
