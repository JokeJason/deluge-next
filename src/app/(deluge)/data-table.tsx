// app/(deluge)/components/data-table.tsx
'use client';

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { ArrowUpDown } from 'lucide-react';

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function DataTable<T extends object>({
  columns,
  data,
}: DataTableProps<T>) {
  // 1) Set up state for sorting
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // 2) configure the table instance
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // ← enable sorting
  });

  return (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No data.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
