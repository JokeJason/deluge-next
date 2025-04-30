'use client';

import { verifyTorrent } from '@/queries/deluge';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useVerifyTorrent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { torrentId: string }) => verifyTorrent(data.torrentId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['allData'] });
    },
  });
}
