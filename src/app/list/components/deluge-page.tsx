// app/list/page.tsx
'use client';

import { DelugeColumns } from '@/app/list/components/deluge-columns';
import { DelugeTable } from '@/app/list/components/deluge-table';
import { useDelugeAllTorrents } from '@/hooks/queries/useDelugeAllTorrents';
import { useDelugeStates } from '@/hooks/queries/useDelugeStates';
import { useDelugeListStore } from '@/lib/store';
import { TorrentState } from '@ctrl/shared-torrent';
import { useEffect, useState } from 'react';

interface DelugePageProps {
  baseUrl: string;
}

function getLabelOptions(allTorrents: Record<string, any>): string[] {
  const labels = new Set<string>();

  Object.values(allTorrents).forEach((torrent) => {
    if (torrent.label) {
      labels.add(torrent.label);
    }
  });

  return Array.from(labels);
}

export default function DelugePage({ baseUrl }: DelugePageProps) {
  const { setDelugeNextBaseUrl } = useDelugeListStore((state) => state);
  const [activeIds, setActiveIds] = useState<string[]>([]);

  const {
    data: allTorrents,
    isLoading: allTorrentsLoading,
    error: allTorrentsError,
  } = useDelugeAllTorrents();
  const { data: allStates, isLoading: allStatesLoading } = useDelugeStates();

  useEffect(() => {
    if (!baseUrl) return;

    // set the base URL in the store at the start
    setDelugeNextBaseUrl(baseUrl);
  }, []);

  useEffect(() => {
    if (!allTorrents) return;

    const active = Object.values(allTorrents).filter(
      (torrent) =>
        torrent.state === TorrentState.downloading ||
        torrent.state === TorrentState.seeding,
    );

    const activeIds = active.map((torrent) => torrent.id);
    setActiveIds(activeIds);
  }, [allTorrents]);

  return (
    <div className='container mx-auto py-8'>
      {allTorrentsLoading && <p>Loading...</p>}
      {allTorrentsError && (
        <p className='text-red-500'>Error: {allTorrentsError.message}</p>
      )}
      {allTorrents && allStates && (
        <DelugeTable
          columns={DelugeColumns}
          data={allTorrents}
          stateOptions={allStates}
          labelOptions={getLabelOptions(allTorrents)}
          activeIds={activeIds}
        />
      )}
    </div>
  );
}
