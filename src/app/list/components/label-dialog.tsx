'use client';

import { updateTorrentLabel } from '@/app/list/actions/update-torrent-label';
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
import { NormalizedTorrentForTable } from '@/types';
import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  label: z.string().min(1, 'Label is required'),
});

export interface LabelDialogProps {
  isLabelDialogOpen: boolean;
  setLabelDialogOpen: (open: boolean) => void;
  torrent: NormalizedTorrentForTable;
}

export function LabelDialog({
  isLabelDialogOpen,
  setLabelDialogOpen,
  torrent,
}: LabelDialogProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: labels } = useQuery({
    queryKey: ['allLabels'],
    queryFn: async () => {
      const token = await getToken();

      const response = await fetch('/api/deluge/labels', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch labels');
      }
      const data = await response.json();
      return data.data as string[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await updateTorrentLabel(torrent.id, data.label);
    if (result.result) {
      await queryClient.invalidateQueries({ queryKey: ['allTorrents'] });
      setLabelDialogOpen(false);
    }
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
