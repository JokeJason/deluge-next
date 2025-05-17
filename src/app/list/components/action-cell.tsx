'use client';

import {
  queueBottom,
  queueDown,
  queueTop,
  queueUp,
} from '@/app/list/actions/change-torrent-queue';
import {
  pauseTorrent,
  resumeTorrent,
} from '@/app/list/actions/change-torrent-state';
import { LabelDialog } from '@/app/list/components/label-dialog';
import { RemoveDialog } from '@/app/list/components/remove-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useVerifyTorrent } from '@/hooks/mutations/useVerifyTorrent';
import { NormalizedTorrentForTable } from '@/types';
import {
  ArrowDownIcon,
  ArrowDownToLineIcon,
  ArrowUpIcon,
  ArrowUpToLineIcon,
  DeleteIcon,
  MoreHorizontal,
  PauseIcon,
  PlayIcon,
} from 'lucide-react';
import { useState } from 'react';

export function ActionCell({
  torrent,
}: {
  torrent: NormalizedTorrentForTable;
}) {
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
          <DropdownMenuItem onClick={() => pauseTorrent(torrent.id)}>
            <PauseIcon /> Pause
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => resumeTorrent(torrent.id)}>
            <PlayIcon /> Resume
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Queue</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => queueTop(torrent.id)}>
                  <ArrowUpToLineIcon /> Top
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => queueUp(torrent.id)}>
                  <ArrowUpIcon /> Up
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => queueDown(torrent.id)}>
                  <ArrowDownIcon /> Down
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => queueBottom(torrent.id)}>
                  <ArrowDownToLineIcon /> Bottom
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setRemoveDialogOpen(true)}>
            <DeleteIcon /> Remove Torrent
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => verifyTorrent.mutate({ torrentId: torrent.id })}
          >
            Force Recheck
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setLabelDialogOpen(true)}>
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
}
