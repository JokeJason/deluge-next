import { TorrentState } from '@ctrl/shared-torrent';

import { NormalizedTorrentForTable } from '@/types';
import type { Torrent } from '@ctrl/deluge';

export function normalizeTorrentTableData(
  id: string,
  torrent: Torrent,
): NormalizedTorrentForTable {
  let state = TorrentState.unknown;
  if (Object.keys(TorrentState).includes(torrent.state.toLowerCase())) {
    state =
      TorrentState[torrent.state.toLowerCase() as keyof typeof TorrentState];
  }

  return {
    id,
    name: torrent.name,
    state,
    totalSelected: torrent.total_size,
    progress: torrent.progress / 100,
    label: torrent.label,
    savePath: torrent.save_path,
    uploadSpeed: torrent.upload_payload_rate,
    downloadSpeed: torrent.download_payload_rate,
    eta: torrent.eta,
    queuePosition: torrent.queue + 1,
  } as NormalizedTorrentForTable;
}
