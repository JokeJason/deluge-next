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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateTorrentLabel } from '@/hooks/mutations/useUpdateTorrentLabel';
import { useLabels } from '@/hooks/queries/useLabels';
import { NormalizedTorrent } from '@ctrl/shared-torrent';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  label: z.string().min(1, 'Label is required'),
});

export interface LabelDialogProps {
  isLabelDialogOpen: boolean;
  setLabelDialogOpen: (open: boolean) => void;
  torrent: NormalizedTorrent;
}

export function LabelDialog({
  isLabelDialogOpen,
  setLabelDialogOpen,
  torrent,
}: LabelDialogProps) {
  const { data: labels } = useLabels();
  const mutation = useUpdateTorrentLabel();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutation.mutate({ torrentId: torrent.id, label: data.label });
  }

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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid gap-4 py-4'
          >
            <FormField
              control={form.control}
              name={'label'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={torrent.label}
                  >
                    <FormControl>
                      <SelectTrigger className={'w-full'}>
                        <SelectValue placeholder={'Select label'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {labels?.map((label) => (
                        <SelectItem key={label} value={label}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit'>Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
