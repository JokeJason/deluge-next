'use server';
import { DefaultResponse, Deluge } from '@ctrl/deluge';
import 'server-only';

const deluge = new Deluge({
  baseUrl: process.env.DELUGE_URL,
  password: process.env.DELUGE_PASSWORD,
  timeout: process.env.DELUGE_TIMEOUT
    ? Number(process.env.DELUGE_TIMEOUT)
    : undefined,
});

export async function pauseTorrent(
  torrentId: string,
): Promise<{ response: DefaultResponse }> {
  const response = await deluge.pauseTorrent(torrentId);

  return { response: response };
}

export async function resumeTorrent(
  torrentId: string,
): Promise<{ response: DefaultResponse }> {
  const response = await deluge.resumeTorrent(torrentId);

  return { response: response };
}
