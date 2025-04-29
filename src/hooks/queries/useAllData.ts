'use client';

import { fetchAllData } from '@/queries/deluge';
import { useQuery } from '@tanstack/react-query';

export function useAllData() {
  return useQuery({
    queryKey: ['allData'],
    queryFn: fetchAllData,
    refetchInterval: 1000 * 60,
  });
}
