// app/list/page.tsx
'use client';

import { DelugeColumns } from '@/app/list/components/deluge-columns';
import { DelugeTable } from '@/app/list/components/deluge-table';
import { useDelugeAllData } from '@/hooks/queries/useDelugeAllData';
import { useDelugeAllTorrents } from '@/hooks/queries/useDelugeAllTorrents';
import { useDelugeBatchTorrents } from '@/hooks/queries/useDelugeBatchTorrents';
import { useDelugeLabels } from '@/hooks/queries/useDelugeLabels';
import { useDelugeStates } from '@/hooks/queries/useDelugeStates';
import { useDelugeListStore } from '@/lib/store';
import { NormalizedTorrent, TorrentState } from '@ctrl/shared-torrent';
import { useEffect, useState } from 'react';

interface DelugePageProps {
  baseUrl: string;
}

export default function DelugePage({ baseUrl }: DelugePageProps) {
  const { setDelugeNextBaseUrl } = useDelugeListStore((state) => state);
  const [activeIds, setActiveIds] = useState<string[]>([]);

  const { data: allData, isLoading, isError, error } = useDelugeAllData();
  const { data: allStates, isLoading: allStatesLoading } = useDelugeStates();
  const { data: allLabels, isLoading: allLabelsLoading } = useDelugeLabels();
  const { data: allTorrents, isLoading: allTorrentsLoading } =
    useDelugeAllTorrents();

  useEffect(() => {
    if (!baseUrl) return;

    // set the base URL in the store at the start
    setDelugeNextBaseUrl(baseUrl);
  }, []);

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

  const activeQueries = useDelugeBatchTorrents(activeIds);

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
      {isLoading && <p>Loading...</p>}
      {isError && (
        <p className='text-red-500'>
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      )}
      {allData && allLabels && allStates && (
        <DelugeTable columns={DelugeColumns} data={merged} />
      )}
    </div>
  );
}
