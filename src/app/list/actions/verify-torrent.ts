'use server';

import { getDelugeClient } from '@/lib/deluge-client';
import 'server-only';

export async function verifyTorrent(torrentId: string) {
  const deluge = await getDelugeClient();
  if (!deluge) {
    throw new Error('Deluge client not available');
  }

  const response = await deluge.verifyTorrent(torrentId);

  return { response: response };
}
