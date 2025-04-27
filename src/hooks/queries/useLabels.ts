'use client';

import { fetchLabels } from '@/queries/deluge';
import { useQuery } from '@tanstack/react-query';

export function useLabels() {
  return useQuery({
    queryKey: ['labels'],
    queryFn: fetchLabels,
  });
}
