'use client';

import { Progress } from '@/components/ui/progress';
import type { DelugeTorrent } from '@/types/torrent';
import { ColumnDef } from '@tanstack/react-table';

const formatBytes = (n: number) => {
  if (n < 1e6) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1e9) return `${(n / 1e6).toFixed(1)} MB`;
  return `${(n / 1e9).toFixed(1)} GB`;
};

const formatSpeed = (n: number) =>
  n > 0 ? `${(n / 1024).toFixed(1)} KB/s` : '—';

const formatETA = (secs: number) => {
  if (secs <= 0) return '—';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return [h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(' ');
};

export const columns: ColumnDef<DelugeTorrent>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => info.getValue<string>(),
  },
  {
    accessorKey: 'totalSelected',
    header: 'Size',
    cell: (info) => formatBytes(info.getValue<number>()),
  },
  {
    accessorKey: 'progress',
    header: 'Progress',
    cell: (info) => (
      <Progress
        value={Math.round(info.getValue<number>() * 100)}
        className='w-24'
      >
        <span className='sr-only'>
          {Math.round(info.getValue<number>() * 100)}%
        </span>
      </Progress>
    ),
  },
  {
    accessorKey: 'downloadSpeed',
    header: 'Down Speed',
    cell: (info) => formatSpeed(info.getValue<number>()),
  },
  {
    accessorKey: 'uploadSpeed',
    header: 'Up Speed',
    cell: (info) => formatSpeed(info.getValue<number>()),
  },
  {
    accessorKey: 'eta',
    header: 'ETA',
    cell: (info) => formatETA(info.getValue<number>()),
  },
  {
    accessorKey: 'raw.tracker_host',
    header: 'Owner',
    cell: (info) => info.getValue<string>() ?? '—',
  },
  {
    accessorKey: 'label',
    header: 'Label',
    cell: (info) => info.getValue<string>() ?? '—',
  },
];
