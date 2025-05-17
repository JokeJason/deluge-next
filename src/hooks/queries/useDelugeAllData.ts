'use client';

import { fetchAllData } from '@/queries/deluge';
import { useQuery } from '@tanstack/react-query';

export function useDelugeAllData() {
  return useQuery({
    queryKey: ['allData'],
    queryFn: fetchAllData,
    refetchInterval: 1000 * 120,
    staleTime: 5 * 60 * 1000,
  });
}
