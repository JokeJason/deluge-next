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
const getTorrentStatusSchema = z.object({
  torrentId: z.string().min(1, 'Torrent ID is required'),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const torrentIdParam = url.searchParams.get('torrentId');

  const parsed = getTorrentStatusSchema.safeParse({
    torrentId: torrentIdParam,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.format() },
      { status: 400 },
    );
  }
  try {
    // Ensure authenticated session and fetch all torrent data
    const data = await deluge.getTorrentStatus(parsed.data.torrentId);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
