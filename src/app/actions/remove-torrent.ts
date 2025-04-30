'use server';
import { Deluge } from '@ctrl/deluge';
import 'server-only';

const deluge = new Deluge({
  baseUrl: process.env.DELUGE_URL,
  password: process.env.DELUGE_PASSWORD,
  timeout: process.env.DELUGE_TIMEOUT
    ? Number(process.env.DELUGE_TIMEOUT)
    : undefined,
});

export async function removeTorrent(
  torrentId: string,
  removeData: boolean,
): Promise<{ response: Boolean }> {
  const response = await deluge.removeTorrent(torrentId, removeData);

  return { response: response.result.valueOf() };
}
