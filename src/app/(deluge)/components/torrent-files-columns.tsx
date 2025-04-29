// app/(deluge)/components/torrent-files-columns.tsx

import { Checkbox } from '@/components/ui/checkbox';
import { TorrentContentFile } from '@ctrl/deluge';
import { ColumnDef } from '@tanstack/react-table';

const formatBytes = (n: number) => {
  if (n < 1e3) return `${n} B`;
  if (n < 1e6) return `${(n / 1e3).toFixed(1)} KB`;
  if (n < 1e9) return `${(n / 1e6).toFixed(1)} MB`;
  return `${(n / 1e9).toFixed(1)} GB`;
};

export const TorrentFilesColumns: ColumnDef<TorrentContentFile>[] = [
  {
    id: 'index',
    accessorKey: 'index',
    header: 'Index',
    cell: ({ row }) => {
      return <span>{row.getValue<number>('index')}</span>;
    },
  },
  {
    id: 'path',
    accessorKey: 'path',
    header: 'Path',
    cell: ({ row }) => {
      return <span>{row.getValue<string>('path')}</span>;
    },
  },
  {
    id: 'length',
    accessorKey: 'length',
    header: 'Size',
    cell: ({ row }) => {
      return <span>{formatBytes(row.getValue<number>('length'))}</span>;
    },
  },
  {
    id: 'select',
    header: 'Select',
    cell: ({ row }) => (
      <div className={'flex items-center justify-center p-2'}>
        <Checkbox
          className={'my-1'}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      </div>
    ),
  },
];
