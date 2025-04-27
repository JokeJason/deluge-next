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

const getHostSchema = z.object({
  host: z.string().min(1, 'Host ID is required'),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const hostParam = url.searchParams.get('host');

  const parsed = getHostSchema.safeParse({ host: hostParam });
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.format() },
      { status: 400 },
    );
  }

  try {
    // Ensure authenticated session and fetch all torrent data
    const data = await deluge.getHostStatus(parsed.data.host);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
