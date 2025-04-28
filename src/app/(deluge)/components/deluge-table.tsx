// app/(deluge)/components/deluge-table.tsx
'use client';

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { AddTorrentDialog } from '@/app/(deluge)/components/add-torrent-dialog';
import { Label, NormalizedTorrent, TorrentState } from '@ctrl/shared-torrent';
import { ArrowUpDown } from 'lucide-react';

interface DelugeTableProps {
  columns: ColumnDef<NormalizedTorrent>[];
  data: NormalizedTorrent[];
  labels: Label[];
}

const stateOptions: TorrentState[] = Object.values(TorrentState);

export function DelugeTable({ columns, data, labels }: DelugeTableProps) {
  const labelOptions = labels.map((label) => label.name);
  const pathOptions = Array.from(new Set(data.map((t) => t.savePath)));

  // 1) Set up state for sorting
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });

  // 2) configure the table instance
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // ← enable sorting
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      pagination,
    },
  });

  return (
    <div>
      {/* ——— Filter Bar ——— */}
      <div className='flex items-center justify-between py-4'>
        <AddTorrentDialog />
        <div className='flex flex-wrap justify-end gap-4 flex-1'>
          {/*/!* Name search *!/*/}
          <Input
            placeholder='Search by name...'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(e) =>
              table.getColumn('name')?.setFilterValue(e.currentTarget.value)
            }
            className='max-w-sm'
          />
          {/* State dropdown */}
          <Select
            value={
              (table.getColumn('state')?.getFilterValue() as string) ?? 'all'
            }
            onValueChange={(val) =>
              table
                .getColumn('state')
                ?.setFilterValue(val === 'all' ? undefined : val)
            }
          >
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Filter by state' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'all'}>All States</SelectItem>
              {stateOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Label dropdown */}
          <Select
            value={
              (table.getColumn('label')?.getFilterValue() as string) ?? 'all'
            }
            onValueChange={(val) =>
              table
                .getColumn('label')
                ?.setFilterValue(val === 'all' ? undefined : val)
            }
          >
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Filter by label' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Labels</SelectItem>
              {labelOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={
              (table.getColumn('savePath')?.getFilterValue() as string) ?? 'all'
            }
            onValueChange={(val) =>
              table
                .getColumn('savePath')
                ?.setFilterValue(val === 'all' ? undefined : val)
            }
          >
            <SelectTrigger className='w-48'>
              <SelectValue placeholder='Filter by path' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Paths</SelectItem>
              {pathOptions.map((path) => (
                <SelectItem key={path} value={path}>
                  {path}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>{' '}
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted(); // 'asc' | 'desc' | false

                  return (
                    <TableHead
                      key={header.id}
                      className={canSort ? 'cursor-pointer select-none' : ''}
                      // 3) toggle sort on click
                      onClick={() => canSort && header.column.toggleSorting()}
                    >
                      <div className='flex items-center space-x-1'>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {canSort && (
                          <ArrowUpDown
                            className={`
                            h-4 w-4 transition-opacity
                            ${sorted ? 'opacity-100' : 'opacity-40'}
                            ${sorted === 'desc' ? 'rotate-180' : ''}
                          `}
                          />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  No data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* ←– NEW: pagination summary + controls */}
      <div className='flex items-center justify-between space-x-4 py-4 px-2'>
        {/* Left side: page info and total rows */}
        <div className='text-sm text-muted-foreground'>
          Page{' '}
          <span className='font-medium'>
            {table.getState().pagination.pageIndex + 1}
          </span>{' '}
          of <span className='font-medium'>{table.getPageCount()}</span> | Total
          Rows:{' '}
          <span className='font-medium'>
            {table.getCoreRowModel().rows.length}
          </span>
        </div>

        {/* Right side: prev/next buttons */}
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
