// app/list/deluge-columns.tsx
'use client';

import { ActionCell } from '@/app/list/components/action-cell';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { NormalizedTorrentForTable } from '@/types';
import { TorrentState } from '@ctrl/shared-torrent';
import { ColumnDef } from '@tanstack/react-table';
import byteSize from 'byte-size';
import { Circle } from 'lucide-react';

const formatBytes = (n: number) => {
  if (n === 0) return '0 B';
  return byteSize(n, { precision: 1 }).toString();
};

const formatSpeed = (n: number) => {
  if (n <= 0) return '—';
  const size = byteSize(n, { precision: 1 });
  return `${size.value} ${size.unit}/s`;
};

const formatETA = (secs: number) => {
  if (secs <= 0) return '—';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return [h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(' ');
};

export const DelugeColumns: ColumnDef<NormalizedTorrentForTable>[] = [
  {
    id: 'state',
    accessorKey: 'state', // assumes your DelugeTorrent has a `state: string` field
    header: '', // no title, just the dot
    enableSorting: true, // disable sorting on this column
    cell: ({ getValue }) => {
      const state = getValue<TorrentState>();
      const colorMap: Record<TorrentState, string> = {
        downloading: 'text-green-500',
        seeding: 'text-blue-500',
        paused: 'text-gray-500',
        queued: 'text-yellow-400',
        checking: 'text-gray-400',
        warning: 'text-orange-500',
        error: 'text-red-500',
        unknown: 'text-black-400',
      };
      const colorClass = colorMap[state] ?? 'text-gray-400';
      return (
        <Tooltip>
          <TooltipTrigger>
            <Circle
              size={12}
              className={colorClass}
              fill={'currentColor'}
              stroke={'none'}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{state.toString()}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    id: 'queue',
    accessorKey: 'queuePosition',
    header: 'Queue',
    cell: (info) => {
      const value = info.getValue<number>();
      return value != 0 ? value : '';
    },
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => info.getValue<string>(),
  },
  {
    id: 'size',
    accessorKey: 'totalSelected',
    header: 'Size',
    cell: (info) => formatBytes(info.getValue<number>()),
  },
  {
    id: 'progress',
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
    id: 'downSpeed',
    accessorKey: 'downloadSpeed',
    header: 'Down Speed',
    cell: (info) => formatSpeed(info.getValue<number>()),
  },
  {
    id: 'upSpeed',
    accessorKey: 'uploadSpeed',
    header: 'Up Speed',
    cell: (info) => formatSpeed(info.getValue<number>()),
  },
  {
    id: 'eta',
    accessorKey: 'eta',
    header: 'ETA',
    cell: (info) => formatETA(info.getValue<number>()),
  },
  {
    id: 'label',
    accessorKey: 'label',
    header: 'Label',
    cell: (info) =>
      info.getValue<string>() === 'noLabel' ? '—' : info.getValue<string>(),
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => <ActionCell torrent={row.original} />,
  },
  {
    id: 'downloadPath',
    accessorKey: 'savePath',
    header: 'Download Path',
    cell: (info) => info.getValue<string>(),
    filterFn: (row, columnId, filterValue) =>
      row.getValue<string>(columnId) === filterValue,
  },
];
