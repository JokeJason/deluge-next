'use server';

import { getDelugeClient } from '@/lib/deluge-client';
import 'server-only';

export async function removeTorrent(
  torrentId: string,
  removeData: boolean,
): Promise<{ response: boolean }> {
  const deluge = await getDelugeClient();
  if (!deluge) {
    throw new Error('Deluge client not available');
  }

  const response = await deluge.removeTorrent(torrentId, removeData);

  return { response: response.result.valueOf() };
}
