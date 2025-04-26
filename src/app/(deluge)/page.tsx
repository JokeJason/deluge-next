// app/(deluge)/page.tsx
import { columns } from '@/app/(deluge)/columns';
import { DataTable } from '@/app/(deluge)/data-table';
import type { DelugeTorrent } from '@/types/torrent';

async function getTorrents(): Promise<DelugeTorrent[]> {
  const origin = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${origin}/api/deluge`, {
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to load torrents');
  }
  return json.data.torrents as DelugeTorrent[];
}

export default async function DelugePage() {
  const torrents = await getTorrents();

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-4'>Deluge Torrents</h1>
      <DataTable<DelugeTorrent> columns={columns} data={torrents} />
    </div>
  );
}
