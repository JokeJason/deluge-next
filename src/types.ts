// TorrentTableRowEntity is a type that only pick certain values from NormalizedTorrent
import { NormalizedTorrent } from '@ctrl/shared-torrent';

export type NormalizedTorrentForTable = Pick<
  NormalizedTorrent,
  | 'id'
  | 'state'
  | 'queuePosition'
  | 'name'
  | 'totalSelected'
  | 'progress'
  | 'downloadSpeed'
  | 'uploadSpeed'
  | 'eta'
  | 'label'
  | 'savePath'
>;

export type DelugeRpcResponse<T> = {
  _data: {
    result: T;
    error?: string;
  };
};
