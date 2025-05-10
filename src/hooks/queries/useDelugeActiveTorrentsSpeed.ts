'use client';

import { fetchActiveTorrentsSpeed } from '@/queries/deluge';
import { useQuery } from '@tanstack/react-query';
import 'client-only';

export function useDelugeActiveTorrentsSpeed(ids: string[]) {
  return useQuery({
    queryKey: ['activeTorrentsSpeed'],
    queryFn: () => fetchActiveTorrentsSpeed(),
    refetchInterval: 1000 * 5, // 5 seconds
  });
}
