import { delugeApi } from '@/lib/delugeApi';
import { DefaultResponse } from '@ctrl/deluge';
import { AllClientData, NormalizedTorrent } from '@ctrl/shared-torrent';

export async function fetchAllData(): Promise<AllClientData> {
  const { data } = await delugeApi.get('/'); // GET /api/deluge
  if (!data.success) throw new Error(data.error);
  return data.data as AllClientData;
}

export async function fetchTorrent(id: string): Promise<NormalizedTorrent> {
  const { data } = await delugeApi.get('/torrent', {
    params: { torrentId: id },
  });
  if (!data.success) throw new Error(data.error);
  return data.data as NormalizedTorrent;
}

export async function fetchLabels(): Promise<string[]> {
  const { data } = await delugeApi.get('/labels');
  if (!data.success) throw new Error(data.error);
  return data.data.result as string[];
}

// update label of a torrent
export async function updateLabel(
  torrentId: string,
  label: string,
): Promise<NormalizedTorrent> {
  const { data } = await delugeApi.put('/torrent/label', {
    torrentId,
    label,
  });
  if (!data.success) throw new Error(data.error);
  return data.data as NormalizedTorrent;
}

export async function removeTorrent(torrentId: string): Promise<Boolean> {
  const { data } = await delugeApi.delete('/torrent', {
    params: { torrentId },
  });
  if (!data.success) throw new Error(data.error);
  return data.data as Boolean;
}

export async function verifyTorrent(
  torrentId: string,
): Promise<DefaultResponse> {
  const { data } = await delugeApi.post('/torrent/verify', {
    torrentId,
  });
  if (!data.success) throw new Error(data.error);
  return data.data as DefaultResponse;
}
