// app/(deluge)/page.tsx
'use client';

import { columns } from '@/app/(deluge)/columns';
import { DataTable } from '@/app/(deluge)/data-table';
import {
  AllClientData,
  NormalizedTorrent,
  TorrentState,
} from '@ctrl/shared-torrent';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

async function fetchAllData() {
  const origin = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${origin}/api/deluge`);
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to load torrents');
  }
  return json.data as AllClientData;
}

async function fetchTorrent(id: string) {
  const origin = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${origin}/api/deluge/torrent?torrentId=${id}`);
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to load torrent');
  }
  return json.data as NormalizedTorrent;
}

export default function DelugePage() {
  const [activeIds, setActiveIds] = useState<string[]>([]);

  const {
    data: allData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['torrents'],
    queryFn: fetchAllData,
    refetchInterval: 1000 * 30, // 30 seconds
  });

  useEffect(() => {
    if (!allData) return;

    const active = allData.torrents.filter(
      (torrent) =>
        torrent.state === TorrentState.downloading ||
        torrent.state === TorrentState.seeding,
    );

    const activeIds = active.map((torrent) => torrent.id);
    setActiveIds(activeIds);
  }, [allData]);

  const activeQueries = useQueries({
    queries: activeIds.map((id) => ({
      queryKey: ['torrent', id],
      queryFn: () => fetchTorrent(id),
      refetchInterval: 1000 * 10, // 30 seconds
    })),
  });

  // extract successful poll results
  const updates = activeQueries
    .map((q) => q.data)
    .filter((d): d is NormalizedTorrent => Boolean(d));

  // build a lookup map id → updated torrent
  const updateMap = new Map<string, NormalizedTorrent>(
    updates.map((u) => [u.id, u]),
  );

  // merge: if we have an update, use it; otherwise fall back to the original
  const merged = allData
    ? allData.torrents.map((t) =>
        updateMap.has(t.id) ? updateMap.get(t.id)! : t,
      )
    : [];

  // TODO: get speed and progress from the torrent status endpoint to merge, so avoid getting entire torrent data

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-4'>Deluge Torrents</h1>
      {isLoading && <p>Loading...</p>}
      {isError && (
        <p className='text-red-500'>
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      )}
      {allData && (
        <DataTable<NormalizedTorrent> columns={columns} data={merged} />
      )}
    </div>
  );
}
