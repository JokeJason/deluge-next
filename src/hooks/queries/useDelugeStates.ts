'use client';

import { fetchStates } from '@/queries/deluge';
import { useQuery } from '@tanstack/react-query';

export function useDelugeStates() {
  return useQuery({
    queryKey: ['allStates'],
    queryFn: fetchStates,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
  });
}
