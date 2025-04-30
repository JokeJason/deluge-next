'use client';

import { LabelDialog } from '@/app/(deluge)/components/label-dialog';
import { RemoveDialog } from '@/app/(deluge)/components/remove-dialog';
import {
  queueBottom,
  queueDown,
  queueTop,
  queueUp,
} from '@/app/actions/change-torrent-queue';
import {
  pauseTorrent,
  resumeTorrent,
} from '@/app/actions/change-torrent-state';
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
import { NormalizedTorrent } from '@ctrl/shared-torrent';
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

export function ActionCell({ torrent }: { torrent: NormalizedTorrent }) {
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
