'use server';

import { getDelugeClient } from '@/lib/deluge-client';
import { DefaultResponse } from '@ctrl/deluge';
import 'server-only';

export async function queueTop(
  torrentId: string,
): Promise<{ response: DefaultResponse }> {
  const deluge = await getDelugeClient();
  if (!deluge) {
    throw new Error('Deluge client not available');
  }

  const response = await deluge.queueTop(torrentId);

  return { response: response };
}

export async function queueUp(
  torrentId: string,
): Promise<{ response: DefaultResponse }> {
  const deluge = await getDelugeClient();
  if (!deluge) {
    throw new Error('Deluge client not available');
  }

  const response = await deluge.queueUp(torrentId);

  return { response: response };
}

export async function queueDown(
  torrentId: string,
): Promise<{ response: DefaultResponse }> {
  const deluge = await getDelugeClient();
  if (!deluge) {
    throw new Error('Deluge client not available');
  }

  const response = await deluge.queueDown(torrentId);

  return { response: response };
}

export async function queueBottom(
  torrentId: string,
): Promise<{ response: DefaultResponse }> {
  const deluge = await getDelugeClient();
  if (!deluge) {
    throw new Error('Deluge client not available');
  }

  const response = await deluge.queueBottom(torrentId);

  return { response: response };
}
