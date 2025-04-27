'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLabels } from '@/hooks/queries/useLabels';

export interface LabelDialogProps {
  isLabelDialogOpen: boolean;
  setLabelDialogOpen: (open: boolean) => void;
}

export function LabelDialog({
  isLabelDialogOpen,
  setLabelDialogOpen,
}: LabelDialogProps) {
  const { data: labels } = useLabels();

  return (
    <Dialog
      open={isLabelDialogOpen}
      onOpenChange={() => setLabelDialogOpen(false)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Label</DialogTitle>
          <DialogDescription>
            Change label use following selector
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {labels && (
            <Select>
              <SelectTrigger className={'w-full'}>
                <SelectValue placeholder={'Label'}></SelectValue>
              </SelectTrigger>
              <SelectContent>
                {labels?.map((label) => (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
