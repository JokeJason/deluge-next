import { AllClientData, NormalizedTorrent } from '@ctrl/shared-torrent';

export async function fetchAllData() {
  const origin = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${origin}/api/deluge`);
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to load torrents');
  }
  return json.data as AllClientData;
}

export async function fetchTorrent(id: string) {
  const origin = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${origin}/api/deluge/torrent?torrentId=${id}`);
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to load torrent');
  }
  return json.data as NormalizedTorrent;
}

export async function fetchLabels() {
  const origin = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${origin}/api/deluge/labels`);
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to load labels');
  }
  return json.data as string[];
}
