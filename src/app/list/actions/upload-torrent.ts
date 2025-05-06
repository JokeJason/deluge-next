// app/actions/upload-torrent.ts
'use server';

import { getDelugeClient } from '@/lib/deluge-client';
import { TorrentInfo } from '@ctrl/deluge';
import 'server-only';

export async function uploadTorrent(
  formData: FormData,
): Promise<{ tmpPath: string; torrentInfo: TorrentInfo }> {
  const deluge = await getDelugeClient();
  if (!deluge) {
    throw new Error('Deluge client not available');
  }

  const file = formData.get('torrentFile');
  if (!(file instanceof File)) throw new Error('No torrent file');

  // 1. Upload raw .torrent to Deluge
  const buffer = await file.arrayBuffer();
  const upload = await deluge.upload(new Uint8Array(buffer));
  if (!upload.success || !upload.files.length)
    throw new Error('Failed to upload torrent');
  const tmpPath = upload.files[0];

  // 2. Fetch file list metadata
  const info = await deluge.getTorrentInfo(tmpPath);

  // 3. Return to client
  return {
    tmpPath,
    torrentInfo: info,
  };
}
