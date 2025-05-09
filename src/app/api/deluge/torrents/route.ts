import { getDelugeClient } from '@/lib/deluge-client';
import { normalizeTorrentTableData } from '@/lib/normalize-torrent-table-data';
import {
  ApiResponse,
  DelugeRpcResponse,
  NormalizedTorrentForTable,
} from '@/types';
import { Torrent } from '@ctrl/deluge';
import { NextResponse } from 'next/server';
import 'server-only';

type DelugeTorrentStatusRpcResponse = DelugeRpcResponse<
  Record<string, Torrent>
>;

type DelugeSessionRpcResponse = DelugeRpcResponse<string[]>;

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
    // fetch all torrent ids by session state
    const allIdsData = (await deluge.request(
      'core.get_session_state',
      [],
    )) as DelugeSessionRpcResponse;
    const allIds = allIdsData._data.result;
    // slice the allIds array into an array of array list, each with 100 ids
    const chunkSize = 100;
    const chunkedIds = [];
    for (let i = 0; i < allIds.length; i += chunkSize) {
      chunkedIds.push(allIds.slice(i, i + chunkSize));
    }

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
    // for each chunkedIds, fetch the torrent info, where key is in the type TorrentTableRowEntity keys

    for (let i = 0; i < chunkedIds.length; i += 1) {
      const data = (await deluge.request('core.get_torrents_status', [
        { id: chunkedIds[i] },
        torrentKeys,
      ])) as DelugeTorrentStatusRpcResponse;
      const dataRecords = data._data.result;
      // push dataRecord into torrents
      for (const key in dataRecords) {
        if (dataRecords[key]) {
          torrents[key] = dataRecords[key];
        }
      }
    }

    // use normalizeTorrentData to convert the torrents array into an array of objects
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
