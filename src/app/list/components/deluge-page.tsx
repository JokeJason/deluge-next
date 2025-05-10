// app/list/page.tsx
'use client';

import { DelugeColumns } from '@/app/list/components/deluge-columns';
import { DelugeTable } from '@/app/list/components/deluge-table';
import { useDelugeActiveTorrents } from '@/hooks/queries/useDelugeActiveTorrents';
import { useDelugeAllTorrents } from '@/hooks/queries/useDelugeAllTorrents';
import { useDelugeStates } from '@/hooks/queries/useDelugeStates';
import { useDelugeListStore } from '@/lib/store';
import { NormalizedTorrentForTable } from '@/types';
import { useEffect, useMemo } from 'react';

interface DelugePageProps {
  baseUrl: string;
}

function computeMergedTorrentsArray(
  allTorrents: Record<string, NormalizedTorrentForTable>,
  activeTorrents?: Record<string, NormalizedTorrentForTable>,
) {
  // calculate merged torrents by replacing the active torrents in all torrents with the active torrents
  const mergedTorrents = { ...allTorrents };
  if (activeTorrents) {
    Object.keys(activeTorrents).forEach((key) => {
      mergedTorrents[key] = { ...mergedTorrents[key], ...activeTorrents[key] };
    });
  }
  return Object.values(mergedTorrents);
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

  const {
    data: allTorrents,
    isLoading: allTorrentsLoading,
    error: allTorrentsError,
  } = useDelugeAllTorrents();
  const { data: allStates } = useDelugeStates();
  const { data: activeTorrents } = useDelugeActiveTorrents();

  useEffect(() => {
    if (!baseUrl) return;

    // set the base URL in the store at the start
    setDelugeNextBaseUrl(baseUrl);
  }, []);

  useEffect(() => {
    if (!allTorrents) return;
  }, [allTorrents]);

  const memorizedTorrents = useMemo(() => {
    if (!allTorrents) return [];

    return computeMergedTorrentsArray(allTorrents, activeTorrents);
  }, [allTorrents, activeTorrents]);

  return (
    <div className='container mx-auto py-8'>
      {allTorrentsLoading && <p>Loading...</p>}
      {allTorrentsError && (
        <p className='text-red-500'>Error: {allTorrentsError.message}</p>
      )}
      {!allTorrentsError && allTorrents && allStates && (
        <DelugeTable
          columns={DelugeColumns}
          data={memorizedTorrents}
          stateOptions={allStates}
          labelOptions={getLabelOptions(allTorrents)}
        />
      )}
    </div>
  );
}
