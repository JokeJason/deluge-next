'use client';

import { fetchTorrentsSpeed } from '@/queries/deluge';
import { useQuery } from '@tanstack/react-query';

export function useDelugeTorrentsSpeed(ids: string[]) {
  return useQuery({
    queryKey: ['torrentsSpeed', ids],
    queryFn: () => fetchTorrentsSpeed(ids),
    refetchInterval: 1000 * 5, // 20 seconds
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
