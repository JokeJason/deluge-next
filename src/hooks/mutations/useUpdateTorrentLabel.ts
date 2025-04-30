'use client';

import { updateLabel } from '@/queries/deluge';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateTorrentLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { torrentId: string; label: string }) =>
      updateLabel(data.torrentId, data.label),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['allData'] });
    },
  });
}
