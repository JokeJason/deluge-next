// app/actions/add-torrent.ts

'use server';
import { AddTorrentResponse, Deluge, TorrentContentFile } from '@ctrl/deluge';
import 'server-only';

const deluge = new Deluge({
  baseUrl: process.env.DELUGE_URL,
  password: process.env.DELUGE_PASSWORD,
  timeout: process.env.DELUGE_TIMEOUT
    ? Number(process.env.DELUGE_TIMEOUT)
    : undefined,
});

export async function addTorrent(
  tmpPath: string,
  torrentContentFiles: TorrentContentFile[],
  selectedIndices: number[],
): Promise<{ result: AddTorrentResponse }> {
  const count = torrentContentFiles.length;

  const file_priorities = Array<number>(count).fill(0);
  for (const idx of selectedIndices) {
    if (idx >= 0 && idx < count) {
      file_priorities[idx] = 1;
    }
  }

  const result = await deluge.addTorrent(tmpPath, {
    file_priorities: file_priorities,
  });

  return { result: result };
}
