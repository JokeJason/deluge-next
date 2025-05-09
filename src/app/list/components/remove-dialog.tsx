import { removeTorrent } from '@/app/list/actions/remove-torrent';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { NormalizedTorrentForTable } from '@/types';

export interface RemoveDialogProps {
  isLabelDialogOpen: boolean;
  setLabelDialogOpen: (open: boolean) => void;
  torrent: NormalizedTorrentForTable;
}

export function RemoveDialog({
  isLabelDialogOpen,
  setLabelDialogOpen,
  torrent,
}: RemoveDialogProps) {
  // TODO: add option of deleting torrent only, without deleting data

  return (
    <AlertDialog
      open={isLabelDialogOpen}
      onOpenChange={() => setLabelDialogOpen(false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove the torrent from the list. This will also
            delete the files on disk.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={'bg-red-500'}
            onClick={() => removeTorrent(torrent.id, true)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
