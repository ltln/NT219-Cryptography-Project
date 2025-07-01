'use client';

import {
  Column,
  Table as TanTable,
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { cn } from '@/app/lib/utils';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import { Button } from './Button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './Select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border-none">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="whitespace-nowrap">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="sticky bottom-0 bg-white border-t-2 flex items-center justify-center gap-4 space-x-2 py-4">
        <div className="absolute bottom-4 left-4">
          <Select onValueChange={(e) => table.setPageSize(Number(e))}>
            <SelectTrigger className="h-8 w-16">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Hiển thị</SelectLabel>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronDoubleLeftIcon className="h-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4" />
          </Button>
        </div>
        <span>
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <div className="flex gap-1">
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronDoubleRightIcon className="h-4" />
          </Button>
        </div>
        <div
          className={cn(
            'absolute bottom-4 right-4',
            table.getIsSomePageRowsSelected() ||
              table.getIsAllPageRowsSelected()
              ? 'visible'
              : 'hidden',
          )}
        >
          <Button
            size="sm"
            variant="outline"
            className="border-red-400 hover:bg-red-100 rounded-md"
          >
            <TrashIcon className="h-6 text-red-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}
