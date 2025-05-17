// app/list/page.tsx
'use client';

import { DelugeColumns } from '@/app/list/components/deluge-columns';
import { DelugeTable } from '@/app/list/components/deluge-table';
import { useDelugeActiveTorrents } from '@/hooks/queries/useDelugeActiveTorrents';
import { useDelugeAllTorrents } from '@/hooks/queries/useDelugeAllTorrents';
import { useDelugeStates } from '@/hooks/queries/useDelugeStates';
import { useDelugeListStore } from '@/lib/store';
import { NormalizedTorrentForTable, TorrentSpeedForTable } from '@/types';
import { useEffect, useMemo } from 'react';

interface DelugePageProps {
  baseUrl: string;
}

function computeMergedTorrentsArray(
  allTorrents: Record<string, NormalizedTorrentForTable>,
  activeTorrentsSpeed?: Record<string, TorrentSpeedForTable>,
) {
  // calculate merged torrents by replacing the active torrents in all torrents with the active torrents
  const mergedTorrents = { ...allTorrents };
  if (activeTorrentsSpeed) {
    Object.keys(activeTorrentsSpeed).forEach((key) => {
      const torrent = allTorrents[key];
      if (torrent) {
        mergedTorrents[key] = {
          ...torrent,
          ...activeTorrentsSpeed[key],
        };
      }
    });
  }
  return Object.values(mergedTorrents);
}

function getLabelOptions(
  allTorrents: Record<string, NormalizedTorrentForTable>,
): string[] {
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
  const { data: activeTorrentsSpeed } = useDelugeActiveTorrents();

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

    return computeMergedTorrentsArray(allTorrents, activeTorrentsSpeed);
  }, [allTorrents, activeTorrentsSpeed]);

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
