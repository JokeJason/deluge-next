import { validateSession } from '@/app/actions/auth';
import { getDelugeClient } from '@/lib/deluge-client';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';
import { z } from 'zod';

// Zod schema for POST body validation
const addTorrentSchema = z.object({
  torrent: z.string().min(1, 'Torrent URL or file content is required'),
  options: z.record(z.any()).optional(),
});

export async function GET() {
  const deluge = await getDelugeClient();
  if (!deluge) {
    return NextResponse.json(
      { success: false, error: 'Deluge client not available' },
      { status: 500 },
    );
  }

  const { authenticated } = await validateSession();
  if (!authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

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
  const deluge = await getDelugeClient();
  if (!deluge) {
    return NextResponse.json(
      { success: false, error: 'Deluge client not available' },
      { status: 500 },
    );
  }

  const { authenticated } = await validateSession();
  if (!authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

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
