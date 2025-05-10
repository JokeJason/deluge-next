'use client';

import { fetchAllTorrents } from '@/queries/deluge';
import { useQuery } from '@tanstack/react-query';

export function useDelugeAllTorrents() {
  return useQuery({
    queryKey: ['allTorrents'],
    queryFn: fetchAllTorrents,
    refetchInterval: 1000 * 60,
    staleTime: 5 * 60 * 1000,
  });
}
