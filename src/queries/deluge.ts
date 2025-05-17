import { api } from '@/lib/api';
import {
  ApiResponse,
  NormalizedTorrentForTable,
  TorrentSpeedForTable,
} from '@/types';
import { DefaultResponse } from '@ctrl/deluge';
import { AllClientData, NormalizedTorrent } from '@ctrl/shared-torrent';

export async function fetchStates(): Promise<string[]> {
  const { data } = await api.get<ApiResponse<string[]>>('/states');
  if (!data.success) throw new Error(data.error);
  return data.data as string[];
}

export async function fetchLabels(): Promise<string[]> {
  const { data } = await api.get<ApiResponse<string[]>>('/labels');
  if (!data.success) throw new Error(data.error);
  return data.data as string[];
}

export async function fetchAllData(): Promise<AllClientData> {
  const { data } = await api.get('/'); // GET /api/deluge
  if (!data.success) throw new Error(data.error);
  return data.data as AllClientData;
}

export async function fetchAllTorrents(): Promise<
  Record<string, NormalizedTorrentForTable> | undefined
> {
  const { data } =
    await api.get<ApiResponse<Record<string, NormalizedTorrentForTable>>>(
      '/torrents',
    );
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export async function fetchActiveTorrents(): Promise<
  Record<string, NormalizedTorrentForTable> | undefined
> {
  const { data } =
    await api.get<ApiResponse<Record<string, NormalizedTorrentForTable>>>(
      '/torrents/active',
    );
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export async function fetchActiveTorrentsSpeed(): Promise<
  Record<string, TorrentSpeedForTable> | undefined
> {
  const { data } = await api.get<
    ApiResponse<Record<string, TorrentSpeedForTable>>
  >('/torrents/active/speed');
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export async function fetchTorrentsSpeed(
  ids: string[],
): Promise<Record<string, TorrentSpeedForTable>> {
  // send POST request to /torrents/speed with ids in the body
  const { data } = await api.post<
    ApiResponse<Record<string, TorrentSpeedForTable>>
  >('/torrents/speed', {
    ids,
  });
  if (!data.success) throw new Error(data.error);
  return data.data as Record<string, TorrentSpeedForTable>;
}

export async function fetchTorrent(id: string): Promise<NormalizedTorrent> {
  const { data } = await api.get('/torrent', {
    params: { torrentId: id },
  });
  if (!data.success) throw new Error(data.error);
  return data.data as NormalizedTorrent;
}

export async function verifyTorrent(
  torrentId: string,
): Promise<DefaultResponse> {
  const { data } = await api.post('/torrent/verify', {
    torrentId,
  });
  if (!data.success) throw new Error(data.error);
  return data.data as DefaultResponse;
}
