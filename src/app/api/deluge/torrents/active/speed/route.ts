import { getDelugeClient } from '@/lib/deluge-client';
import { ApiResponse, DelugeRpcResponse, TorrentSpeedForTable } from '@/types';
import { TorrentState } from '@ctrl/shared-torrent';
import { pascalCase } from 'change-case';
import { NextResponse } from 'next/server';

type DelugeTorrentSpeedRpcResponse = DelugeRpcResponse<
  Record<string, TorrentSpeedForTable>
>;

export async function GET(): Promise<
  NextResponse<ApiResponse<Record<string, TorrentSpeedForTable>>>
> {
  const deluge = await getDelugeClient();
  if (!deluge) {
    return NextResponse.json(
      { success: false, error: 'Deluge client not initialized' },
      { status: 500 },
    );
  }

  try {
    const torrents: Record<string, TorrentSpeedForTable> = {};
    const torrentKeys: string[] = [
      'progress',
      'download_payload_rate',
      'upload_payload_rate',
      'eta',
    ];

    let data = (await deluge.request('core.get_torrents_status', [
      { state: pascalCase(TorrentState.seeding) },
      torrentKeys,
    ])) as DelugeTorrentSpeedRpcResponse;
    // push data._data.result to torrents
    const seedingTorrents = data._data.result;
    for (const key in seedingTorrents) {
      if (seedingTorrents[key]) {
        torrents[key] = {
          ...seedingTorrents[key],
          progress: seedingTorrents[key].progress / 100,
        };
      }
    }

    data = (await deluge.request('core.get_torrents_status', [
      { state: pascalCase(TorrentState.downloading) },
      torrentKeys,
    ])) as DelugeTorrentSpeedRpcResponse;
    const downloadTorrents = data._data.result;
    for (const key in downloadTorrents) {
      if (downloadTorrents[key]) {
        torrents[key] = {
          ...downloadTorrents[key],
          progress: downloadTorrents[key].progress / 100,
        };
      }
    }

    data = (await deluge.request('core.get_torrents_status', [
      { state: pascalCase(TorrentState.checking) },
      torrentKeys,
    ])) as DelugeTorrentSpeedRpcResponse;
    const checkingTorrents = data._data.result;
    for (const key in checkingTorrents) {
      if (checkingTorrents[key]) {
        torrents[key] = {
          ...checkingTorrents[key],
          progress: checkingTorrents[key].progress / 100,
        };
      }
    }

    return NextResponse.json({ success: true, data: torrents });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
