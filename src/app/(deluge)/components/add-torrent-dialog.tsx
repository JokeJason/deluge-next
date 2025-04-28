// app/(deluge)/components/add-torrent-dialog.tsx
'use client';

import { TorrentFilesColumns } from '@/app/(deluge)/components/torrent-files-columns';
import { TorrentFilesTable } from '@/app/(deluge)/components/torrent-files-table';
import { uploadTorrent } from '@/app/actions/upload-torrent';
import { Button } from '@/components/ui/button';
import {
  Dialog,
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
import { useLabels } from '@/hooks/queries/useLabels';
import {
  TorrentContentDir,
  TorrentContentFile,
  TorrentInfo,
} from '@ctrl/deluge';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
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
  const { data: labels } = useLabels();

  const [isUploading, setIsUploading] = useState(false);
  const [torrentFiles, setTorrentFiles] = useState<
    { name: string; length: number }[]
  >([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

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

  useEffect(() => {
    console.log('torrentInfo', torrentInfo);
  }, [torrentInfo]);

  useEffect(() => {
    console.log('tmpPath', tmpPath);
  }, [tmpPath]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    throw new Error('Not implemented');
  }

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
              name={'torrentFile'}
              render={({ field: { onChange, value, ...field } }) => {
                return (
                  <FormItem>
                    <FormLabel>Torrent File</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='file'
                        accept='.torrent'
                        multiple={false}
                        onChange={(e) => onChange(e.target.files)}
                        className={`cursor-pointer file:px-4 file:py-1`}
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
          <div className={'mt-4 overflow-x-auto'}>
            <TorrentFilesTable
              columns={TorrentFilesColumns}
              data={flattenContents(torrentInfo.result.files_tree.contents)}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
