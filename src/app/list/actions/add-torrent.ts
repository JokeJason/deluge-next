// app/actions/add-torrent.ts
'use server';

import { getDelugeClient } from '@/lib/deluge-client';
import { AddTorrentResponse, TorrentContentFile } from '@ctrl/deluge';
import 'server-only';

export async function addTorrent(
  tmpPath: string,
  torrentContentFiles: TorrentContentFile[],
  selectedIndices: number[],
): Promise<{ result: AddTorrentResponse }> {
  const deluge = await getDelugeClient();
  if (!deluge) {
    throw new Error('Deluge client not available');
  }

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
