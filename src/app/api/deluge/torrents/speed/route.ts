import { getDelugeClient } from '@/lib/deluge-client';
import { ApiResponse, DelugeRpcResponse, TorrentSpeedForTable } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

type DelugeTorrentSpeedRpcResponse = DelugeRpcResponse<
  Record<string, TorrentSpeedForTable>
>;

// GET endpoint cannot parse in json payload, to contain ids, we need to use POST
export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<Record<string, TorrentSpeedForTable>>>> {
  const deluge = await getDelugeClient();
  if (!deluge) {
    return NextResponse.json(
      { success: false, error: 'Deluge client not initialized' },
      { status: 500 },
    );
  }

  // get ids from the request json
  const { ids } = await request.json();

  try {
    const torrentKeys: string[] = [
      'progress',
      'download_payload_rate',
      'upload_payload_rate',
      'eta',
    ];

    const data = (await deluge.request('core.get_torrents_status', [
      { id: ids },
      torrentKeys,
    ])) as DelugeTorrentSpeedRpcResponse;

    return NextResponse.json({
      success: true,
      data: data._data.result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
