import { api } from '@/lib/api';
import { DefaultResponse } from '@ctrl/deluge';
import { AllClientData, NormalizedTorrent } from '@ctrl/shared-torrent';

export async function fetchStates(): Promise<[string, number][]> {
  const { data } = await api.get('/states');
  if (!data.success) throw new Error(data.error);
  return data.data as [string, number][];
}

export async function fetchAllData(): Promise<AllClientData> {
  const { data } = await api.get('/'); // GET /api/deluge
  if (!data.success) throw new Error(data.error);
  return data.data as AllClientData;
}

export async function fetchTorrent(id: string): Promise<NormalizedTorrent> {
  const { data } = await api.get('/torrent', {
    params: { torrentId: id },
  });
  if (!data.success) throw new Error(data.error);
  return data.data as NormalizedTorrent;
}

export async function fetchLabels(): Promise<string[]> {
  const { data } = await api.get('/labels');
  if (!data.success) throw new Error(data.error);
  return data.data.result as string[];
}

// update label of a torrent
export async function updateLabel(
  torrentId: string,
  label: string,
): Promise<NormalizedTorrent> {
  const { data } = await api.put('/torrent/label', {
    torrentId,
    label,
  });
  if (!data.success) throw new Error(data.error);
  return data.data as NormalizedTorrent;
}

export async function removeTorrent(torrentId: string): Promise<boolean> {
  const { data } = await api.delete('/torrent', {
    params: { torrentId },
  });
  if (!data.success) throw new Error(data.error);
  return data.data as boolean;
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
