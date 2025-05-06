'use server';

import { getDelugeClient } from '@/lib/deluge-client';
import 'server-only';

export async function updateTorrentLabel(torrentId: string, label: string) {
  const deluge = await getDelugeClient();
  if (!deluge) {
    throw new Error('Deluge client not available');
  }

  return await deluge.setTorrentLabel(torrentId, label);
}
