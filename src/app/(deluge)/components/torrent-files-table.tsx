// app/(deluge)/components/torrent-files-table.tsx

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TorrentContentFile } from '@ctrl/deluge';

interface TorrentFilesTableProps {
  columns: ColumnDef<TorrentContentFile>[];
  data: TorrentContentFile[];
  setSelectedIndices: (indices: number[]) => void;
}

function calculateRowSelection(rowSelection: Record<string, boolean>): number {
  return Object.values(rowSelection).filter((value) => value).length;
}

function getSelectedFileIndices(
  rowSelection: Record<string, boolean>,
  data: TorrentContentFile[],
): number[] {
  return Object.entries(rowSelection)
    .filter(([, isSelected]) => isSelected)
    .map(([rowId]) => data[Number(rowId)].index);
}

export function TorrentFilesTable({
  columns,
  data,
  setSelectedIndices,
}: TorrentFilesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    const selectedIndices = getSelectedFileIndices(rowSelection, data);
    setSelectedIndices(selectedIndices);
  }, [rowSelection, setSelectedIndices, data]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  const selectedCount = calculateRowSelection(rowSelection);

  return (
    <div className={'w-full'}>
      <div className={'rounded-md border'}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length} className='text-right'>
                Selected {selectedCount} of {data.length} files
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
