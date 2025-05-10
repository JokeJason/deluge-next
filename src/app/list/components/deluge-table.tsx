// app/list/components/deluge-list.tsx
'use client';

import { AddTorrentDialog } from '@/app/list/components/add-torrent-dialog';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { NormalizedTorrentForTable } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
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
import { camelCase, pascalCase } from 'change-case';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface DelugeTableProps {
  columns: ColumnDef<NormalizedTorrentForTable>[];
  data: NormalizedTorrentForTable[];
  stateOptions: string[];
  labelOptions: string[];
}

export function DelugeTable({
  columns,
  data,
  stateOptions,
  labelOptions,
}: DelugeTableProps) {
  const queryClient = useQueryClient();

  // 1) Set up state for sorting
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });

  // 2) configure the list instance
  const table = useReactTable({
    data: data,
    columns: columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
      <div className='flex items-center justify-between py-4'>
        <AddTorrentDialog />
        <div className='flex flex-wrap justify-end gap-4 flex-1'>
          <Input
            placeholder='Search by name...'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(e) =>
              table.getColumn('name')?.setFilterValue(e.currentTarget.value)
            }
            className='max-w-sm'
          />
          <Select
            value={
              (table.getColumn('state')?.getFilterValue() as string) ?? 'all'
            }
            onValueChange={(val) => {
              if (val === 'all') {
                table.getColumn('state')?.setFilterValue(undefined);
              } else {
                table.getColumn('state')?.setFilterValue(val);
              }
            }}
          >
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Filter by state' />
            </SelectTrigger>
            <SelectContent>
              {stateOptions.map((opt) => (
                <SelectItem key={camelCase(opt)} value={camelCase(opt)}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={
              (table.getColumn('label')?.getFilterValue() as string) ?? 'all'
            }
            onValueChange={(val) => {
              if (val === 'all') {
                table.getColumn('label')?.setFilterValue(undefined);
              } else {
                table.getColumn('label')?.setFilterValue(val);
              }
            }}
          >
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Filter by label' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Labels</SelectItem>
              {labelOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt === 'noLabel' ? 'No Label' : pascalCase(opt)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={'pt-1.5'}>
                <RefreshCw
                  className={'hover:animate-spin animate-once'}
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: ['allTorrents'],
                    });
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh</p>
            </TooltipContent>
          </Tooltip>
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
