// app/actions/upload-torrent.ts

'use server';
import { Deluge, TorrentInfo } from '@ctrl/deluge';
import 'server-only';

const deluge = new Deluge({
  baseUrl: process.env.DELUGE_URL,
  password: process.env.DELUGE_PASSWORD,
  timeout: process.env.DELUGE_TIMEOUT
    ? Number(process.env.DELUGE_TIMEOUT)
    : undefined,
});

export async function uploadTorrent(
  formData: FormData,
): Promise<{ tmpPath: string; torrentInfo: TorrentInfo }> {
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
