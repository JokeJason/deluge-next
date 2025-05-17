import { Deluge } from '@ctrl/deluge';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';
import { z } from 'zod';

// TODO: remove this when server action is done
const deluge = new Deluge({
  baseUrl: process.env.DELUGE_URL,
  password: process.env.DELUGE_PASSWORD,
  timeout: process.env.DELUGE_TIMEOUT
    ? Number(process.env.DELUGE_TIMEOUT)
    : undefined,
});

// Zod schema for PUT body validation
const setTorrentLabelSchema = z.object({
  torrentId: z.string().min(1, 'Torrent URL or file content is required'),
  label: z.string().min(1, 'Label is required'),
});

export async function PUT(request: NextRequest) {
  try {
    // Parse and validate request body
    const json = await request.json();
    const parsed = setTorrentLabelSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.format() },
        { status: 400 },
      );
    }

    const { torrentId, label } = parsed.data;
    const result = await deluge.setTorrentLabel(torrentId, label);
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
