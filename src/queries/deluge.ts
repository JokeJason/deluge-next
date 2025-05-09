import { api } from '@/lib/api';
import { ApiResponse, NormalizedTorrentForTable } from '@/types';
import { DefaultResponse } from '@ctrl/deluge';
import { AllClientData, NormalizedTorrent } from '@ctrl/shared-torrent';

export async function fetchStates(): Promise<string[]> {
  const { data } = await api.get('/states');
  if (!data.success) throw new Error(data.error);
  return data.states as string[];
}

export async function fetchLabels(): Promise<string[]> {
  const { data } = await api.get('/labels');
  if (!data.success) throw new Error(data.error);
  return data.labels as string[];
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
