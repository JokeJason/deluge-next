import { getDelugeClient } from '@/lib/deluge-client';
import { normalizeTorrentTableData } from '@/lib/normalize-torrent-table-data';
import {
  ApiResponse,
  DelugeRpcResponse,
  NormalizedTorrentForTable,
} from '@/types';
import { Torrent } from '@ctrl/deluge';
import { TorrentState } from '@ctrl/shared-torrent';
import { pascalCase } from 'change-case';
import { NextResponse } from 'next/server';
import 'server-only';

type DelugeTorrentStatusRpcResponse = DelugeRpcResponse<
  Record<string, Torrent>
>;

// TODO: delete this one torrents/active/speed endpoint is implemented
export async function GET(): Promise<
  NextResponse<ApiResponse<Record<string, NormalizedTorrentForTable>>>
> {
  const deluge = await getDelugeClient();
  if (!deluge) {
    return NextResponse.json(
      { success: false, error: 'Deluge client not initialized' },
      { status: 500 },
    );
  }

  try {
    const torrents: Record<string, Torrent> = {};
    // get keys from the type TorrentTableRowEntity
    const torrentKeys: string[] = [
      'state',
      'queue',
      'name',
      'total_size',
      'progress',
      'download_payload_rate',
      'upload_payload_rate',
      'eta',
      'label',
      'save_path',
    ];

    let data = (await deluge.request('core.get_torrents_status', [
      { state: pascalCase(TorrentState.seeding) },
      torrentKeys,
    ])) as DelugeTorrentStatusRpcResponse;
    let dataRecords = data._data.result;
    for (const key in dataRecords) {
      if (dataRecords[key]) {
        const singleTorrent = dataRecords[key];
        if (singleTorrent.label === '') {
          singleTorrent.label = 'noLabel';
        }
        torrents[key] = singleTorrent;
      }
    }
    data = (await deluge.request('core.get_torrents_status', [
      { state: pascalCase(TorrentState.downloading) },
      torrentKeys,
    ])) as DelugeTorrentStatusRpcResponse;
    dataRecords = data._data.result;
    for (const key in dataRecords) {
      if (dataRecords[key]) {
        const singleTorrent = dataRecords[key];
        if (singleTorrent.label === '') {
          singleTorrent.label = 'noLabel';
        }
        torrents[key] = singleTorrent;
      }
    }

    const normalizedTorrents: Record<string, NormalizedTorrentForTable> = {};
    for (const key in torrents) {
      normalizedTorrents[key] = normalizeTorrentTableData(key, torrents[key]);
    }

    return NextResponse.json({ success: true, data: normalizedTorrents });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
