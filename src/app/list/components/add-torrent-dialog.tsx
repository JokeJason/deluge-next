// app/list/components/add-torrent-dialog.tsx
'use client';

import { addTorrent } from '@/app/list/actions/add-torrent';
import { uploadTorrent } from '@/app/list/actions/upload-torrent';
import { TorrentFilesColumns } from '@/app/list/components/torrent-files-columns';
import { TorrentFilesTable } from '@/app/list/components/torrent-files-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  TorrentContentDir,
  TorrentContentFile,
  TorrentInfo,
} from '@ctrl/deluge';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export function flattenContents(
  node: Record<string, TorrentContentDir | TorrentContentFile>,
): TorrentContentFile[] {
  return Object.values(node).flatMap((item) => {
    if (item.type === 'file') {
      return [item];
    }

    // assert that .contents is actually the same Record<string, …> shape
    const dir = item as TorrentContentDir & {
      contents: Record<string, TorrentContentDir | TorrentContentFile>;
    };

    return flattenContents(dir.contents);
  });
}

const formSchema = z.object({
  torrentFile: z
    .custom<FileList>(
      (val) => {
        if (typeof window === 'undefined') return false;
        return val instanceof FileList;
      },
      { message: 'Select exactly one .torrent file' },
    )
    .refine((files) => files.length === 1, 'Select exactly one file')
    .refine(
      (files) => files[0]?.name.endsWith('.torrent'),
      'File must be a .torrent',
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function AddTorrentDialog() {
  const queryClient = useQueryClient();

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const [tmpPath, setTmpPath] = useState<string | null>(null);
  const [torrentInfo, setTorrentInfo] = useState<TorrentInfo | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      torrentFile: undefined,
    },
  });

  const onPreview = async (data: FormValues) => {
    const file = data.torrentFile[0];
    const formData = new FormData();
    formData.append('torrentFile', file);

    const result = await uploadTorrent(formData);
    setTmpPath(result.tmpPath);
    setTorrentInfo(result.torrentInfo);
  };

  const onAdd = async () => {
    if (!tmpPath) return;
    if (!torrentInfo) return;

    const result = await addTorrent(
      tmpPath,
      flattenContents(torrentInfo?.result.files_tree.contents),
      selectedIndices,
    );

    if (result) {
      queryClient.invalidateQueries({ queryKey: ['allData'] });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={'bg-green-500 text-white hover:bg-green-600'}>
          Add Torrent
        </Button>
      </DialogTrigger>
      <DialogContent className={'max-w-4xl'}>
        <DialogHeader>
          <DialogTitle>Upload a Torrent</DialogTitle>
          <DialogDescription>
            Select a torrent file to upload and click the submit button.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onPreview)}
            className='grid gap-4 py-4'
          >
            <FormField
              control={form.control}
              name='torrentFile'
              render={({ field }) => {
                const { onChange, onBlur, name, ref } = field;
                return (
                  <FormItem>
                    <FormLabel>Torrent File</FormLabel>
                    <FormControl>
                      <Input
                        name={name}
                        ref={ref}
                        onBlur={onBlur}
                        type='file'
                        accept='.torrent'
                        multiple={false}
                        onChange={(e) => onChange(e.target.files)}
                        className='cursor-pointer file:px-4 file:py-1'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <DialogFooter>
              <Button type='submit'>Preview Torrent</Button>
            </DialogFooter>
          </form>
        </Form>
        {torrentInfo && (
          <>
            <div className='mt-4 overflow-x-auto'>
              <TorrentFilesTable
                columns={TorrentFilesColumns}
                data={flattenContents(torrentInfo.result.files_tree.contents)}
                setSelectedIndices={setSelectedIndices}
              />
            </div>
            <DialogClose asChild>
              <div className='mt-4 flex justify-end'>
                <Button onClick={onAdd}>Add Torrent</Button>
              </div>
            </DialogClose>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
