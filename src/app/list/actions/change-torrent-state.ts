'use server';

import { getDelugeClient } from '@/lib/deluge-client';
import { DefaultResponse } from '@ctrl/deluge';
import 'server-only';

export async function pauseTorrent(
  torrentId: string,
): Promise<{ response: DefaultResponse }> {
  const deluge = await getDelugeClient();
  if (!deluge) {
    throw new Error('Deluge client not available');
  }

  const response = await deluge.pauseTorrent(torrentId);

  return { response: response };
}

export async function resumeTorrent(
  torrentId: string,
): Promise<{ response: DefaultResponse }> {
  const deluge = await getDelugeClient();
  if (!deluge) {
    throw new Error('Deluge client not available');
  }

  const response = await deluge.resumeTorrent(torrentId);

  return { response: response };
}
