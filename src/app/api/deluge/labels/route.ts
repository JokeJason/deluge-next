import { validateSession } from '@/app/actions/auth';
import { getDelugeClient } from '@/lib/deluge-client';
import { ApiResponse } from '@/types';
import { NextResponse } from 'next/server';
import 'server-only';

export async function GET(): Promise<NextResponse<ApiResponse<string[]>>> {
  const { authenticated } = await validateSession();
  if (!authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

  const deluge = await getDelugeClient();
  if (!deluge) {
    return NextResponse.json(
      { success: false, error: 'Deluge client not available' },
      { status: 500 },
    );
  }

  try {
    // Ensure authenticated session and fetch all torrent data
    const data = await deluge.getLabels();
    return NextResponse.json({
      success: true,
      data: data.result,
    } as ApiResponse<string[]>);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
