import { Deluge } from '@ctrl/deluge';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const deluge = new Deluge({
  baseUrl: process.env.DELUGE_URL,
  password: process.env.DELUGE_PASSWORD,
  timeout: process.env.DELUGE_TIMEOUT
    ? Number(process.env.DELUGE_TIMEOUT)
    : undefined,
});

// Zod schema for POST body validation
const addTorrentSchema = z.object({
  torrent: z.string().min(1, 'Torrent URL or file content is required'),
  options: z.record(z.any()).optional(),
});

export async function GET() {
  try {
    // Ensure authenticated session and fetch all torrent data
    const data = await deluge.getAllData();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const json = await request.json();
    const parsed = addTorrentSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.format() },
        { status: 400 },
      );
    }

    const { torrent, options } = parsed.data;
    const result = await deluge.normalizedAddTorrent(torrent, options);
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
