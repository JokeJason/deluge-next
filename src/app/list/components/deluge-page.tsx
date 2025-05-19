// app/list/page.tsx
'use client';

import { DelugeColumns } from '@/app/list/components/deluge-columns';
import { DelugeTable } from '@/app/list/components/deluge-table';
import { useDelugeListStore } from '@/lib/store';
import { NormalizedTorrentForTable, TorrentSpeedForTable } from '@/types';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
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
  const { getToken } = useAuth();
  const { setDelugeNextBaseUrl } = useDelugeListStore((state) => state);

  const {
    data: allTorrents,
    isLoading: allTorrentsLoading,
    error: allTorrentsError,
  } = useQuery({
    queryKey: ['allTorrents'],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch('/api/deluge/torrents', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      return result.data;
    },
    refetchInterval: 1000 * 60,
    staleTime: 5 * 60 * 1000,
  });
  const { data: allStates } = useQuery({
    queryKey: ['allStates'],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch('/api/deluge/states', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      return result.data;
    },
  });
  const { data: activeTorrentsSpeed } = useQuery({
    queryKey: ['activeTorrentsSpeed'],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch('/api/deluge/torrents/active/speed', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      return result.data;
    },
    refetchInterval: 1000 * 60,
    staleTime: 5 * 60 * 1000,
  });

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
