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

export async function queueTop(
  torrentId: string,
): Promise<{ response: DefaultResponse }> {
  const response = await deluge.queueTop(torrentId);

  return { response: response };
}

export async function queueUp(
  torrentId: string,
): Promise<{ response: DefaultResponse }> {
  const response = await deluge.queueUp(torrentId);

  return { response: response };
}

export async function queueDown(
  torrentId: string,
): Promise<{ response: DefaultResponse }> {
  const response = await deluge.queueDown(torrentId);

  return { response: response };
}

export async function queueBottom(
  torrentId: string,
): Promise<{ response: DefaultResponse }> {
  const response = await deluge.queueBottom(torrentId);

  return { response: response };
}
