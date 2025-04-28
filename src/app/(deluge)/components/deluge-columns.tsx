// app/(deluge)/deluge-columns.tsx
'use client';

import { LabelDialog } from '@/app/(deluge)/components/label-dialog';
import { RemoveDialog } from '@/app/(deluge)/components/remove-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useVerifyTorrent } from '@/hooks/mutations/useVerifyTorrent';
import { NormalizedTorrent, TorrentState } from '@ctrl/shared-torrent';
import { ColumnDef } from '@tanstack/react-table';
import { Circle, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

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

export const DelugeColumns: ColumnDef<NormalizedTorrent>[] = [
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
    accessorKey: 'queuePosition',
    header: 'Queue',
    cell: (info) => {
      const value = info.getValue<number>();
      return value != 0 ? value : '';
    },
  },
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
    accessorKey: 'label',
    header: 'Label',
    cell: (info) => info.getValue<string>() ?? '—',
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      const torrent = row.original;
      const [isLabelDialogOpen, setLabelDialogOpen] = useState(false);
      const [isRemoveDialogOpen, setRemoveDialogOpen] = useState(false);
      const verifyTorrent = useVerifyTorrent();

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel className={'font-bold'}>
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(torrent.id)}
              >
                Pause
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log(torrent.id)}>
                Resume
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setRemoveDialogOpen(true)}>
                Remove Torrent
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => verifyTorrent.mutate({ torrentId: torrent.id })}
              >
                Force Recheck
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setLabelDialogOpen(true);
                }}
              >
                Label
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <RemoveDialog
            isLabelDialogOpen={isRemoveDialogOpen}
            setLabelDialogOpen={setRemoveDialogOpen}
            torrent={torrent}
          />

          <LabelDialog
            isLabelDialogOpen={isLabelDialogOpen}
            setLabelDialogOpen={setLabelDialogOpen}
            torrent={torrent}
          />
        </>
      );
    },
  },
  {
    accessorKey: 'savePath',
    header: 'Download Path',
    cell: (info) => info.getValue<string>(),
    filterFn: (row, columnId, filterValue) =>
      row.getValue<string>(columnId) === filterValue,
  },
];
