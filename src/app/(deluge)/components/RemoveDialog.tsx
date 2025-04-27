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
import { useUpdateTorrentLabel } from '@/hooks/mutations/useUpdateTorrentLabel';
import { NormalizedTorrent } from '@ctrl/shared-torrent';

export interface RemoveDialogProps {
  isLabelDialogOpen: boolean;
  setLabelDialogOpen: (open: boolean) => void;
  torrent: NormalizedTorrent;
}

export function RemoveDialog({
  isLabelDialogOpen,
  setLabelDialogOpen,
  torrent,
}: RemoveDialogProps) {
  const mutation = useUpdateTorrentLabel();

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
          <AlertDialogAction className={'bg-red-500'}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
