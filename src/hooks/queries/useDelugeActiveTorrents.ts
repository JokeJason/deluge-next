'use client';

import { fetchActiveTorrents } from '@/queries/deluge';
import { useQuery } from '@tanstack/react-query';
import 'client-only';

export function useDelugeActiveTorrents() {
  return useQuery({
    queryKey: ['activeTorrents'],
    queryFn: fetchActiveTorrents,
    refetchInterval: 1000 * 2, // 10 seconds
  });
}
