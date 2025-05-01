// app/(deluge)/page.tsx
'use client';

import { DelugeColumns } from '@/app/(deluge)/components/deluge-columns';
import { DelugeTable } from '@/app/(deluge)/components/deluge-table';
import { useAllData } from '@/hooks/queries/useAllData';
import { useTorrents } from '@/hooks/queries/useTorrents';
import { useCountStore } from '@/lib/store';
import { NormalizedTorrent, TorrentState } from '@ctrl/shared-torrent';
import { useEffect, useState } from 'react';

interface DelugePageProps {
  baseUrl: string;
}

export default function DelugePage({ baseUrl }: DelugePageProps) {
  const { setDelugeNextBaseUrl } = useCountStore((state) => state);
  const [activeIds, setActiveIds] = useState<string[]>([]);

  const { data: allData, isLoading, isError, error } = useAllData();

  useEffect(() => {
    if (!baseUrl) return;

    // set the base URL in the store
    setDelugeNextBaseUrl(baseUrl);
  }, [setDelugeNextBaseUrl, baseUrl]);

  useEffect(() => {
    if (!allData) return;

    const active = allData.torrents.filter(
      (torrent) => torrent.state === TorrentState.downloading,
    );

    const activeIds = active.map((torrent) => torrent.id);
    setActiveIds(activeIds);
  }, [allData]);

  const activeQueries = useTorrents(activeIds);

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
        <DelugeTable
          columns={DelugeColumns}
          data={merged}
          labels={allData.labels}
        />
      )}
    </div>
  );
}
