'use client';

import { fetchStates } from '@/queries/deluge';
import { useQuery } from '@tanstack/react-query';

export function useDelugeStates() {
  return useQuery({
    queryKey: ['states'],
    queryFn: fetchStates,
    staleTime: 5 * 60 * 1000,
  });
}
