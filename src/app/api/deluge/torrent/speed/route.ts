import { validateSession } from '@/app/actions/auth';
import { Deluge } from '@ctrl/deluge';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';
import { z } from 'zod';

const deluge = new Deluge({
  baseUrl: process.env.DELUGE_URL,
  password: process.env.DELUGE_PASSWORD,
  timeout: process.env.DELUGE_TIMEOUT
    ? Number(process.env.DELUGE_TIMEOUT)
    : undefined,
});

// Zod schema for POST body validation
const getTorrentSpeedSchema = z.object({
  torrentId: z.string().min(1, 'Torrent ID is required'),
});

const getTorrentSpeedResponseSchema = z.object({
  uploadSpeed: z.number(),
  downloadSpeed: z.number(),
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
  const torrentIdParam = url.searchParams.get('torrentId');

  const parsed = getTorrentSpeedSchema.safeParse({ torrentId: torrentIdParam });
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.format() },
      { status: 400 },
    );
  }
  try {
    // Ensure authenticated session and fetch all torrent data
    const data = await deluge.getTorrent(parsed.data.torrentId);
    // Validate the response
    const speedData = {
      uploadSpeed: data.uploadSpeed,
      downloadSpeed: data.downloadSpeed,
    };
    const validation = getTorrentSpeedResponseSchema.safeParse(speedData);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.format() },
        { status: 500 },
      );
    }
    return NextResponse.json({ success: true, data: validation.data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
