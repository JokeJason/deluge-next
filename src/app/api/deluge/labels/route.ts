import { validateSession } from '@/app/actions/auth';
import { Deluge } from '@ctrl/deluge';
import { NextResponse } from 'next/server';
import 'server-only';

const deluge = new Deluge({
  baseUrl: process.env.DELUGE_URL,
  password: process.env.DELUGE_PASSWORD,
  timeout: process.env.DELUGE_TIMEOUT
    ? Number(process.env.DELUGE_TIMEOUT)
    : undefined,
});

export async function GET() {
  const { authenticated } = await validateSession();
  if (!authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

  try {
    // Ensure authenticated session and fetch all torrent data
    const data = await deluge.getLabels();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { label } = await request.json();
    // Supports magnet links or uploaded .torrent content
    const result = await deluge.addLabel(label);
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { label } = await request.json();
    // Supports magnet links or uploaded .torrent content
    const result = await deluge.removeLabel(label);
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
