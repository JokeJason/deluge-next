'use client';

import { fetchLabels } from '@/queries/deluge';
import { useQuery } from '@tanstack/react-query';

export function useDelugeLabels() {
  return useQuery({
    queryKey: ['allLabels'],
    queryFn: fetchLabels,
    staleTime: 5 * 60 * 1000,
  });
}
