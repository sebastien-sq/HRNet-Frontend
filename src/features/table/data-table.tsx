"use client"

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    type SortingState,
    getSortedRowModel,
    type ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { filters } from "@/utils/variables"
import { DataTablePagination } from "./data-table-pagination"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [filterType, setFilterType] = useState<string>("")
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })

    const handleFilterTypeChange = (value: string) => {
        if (filterType) {
            table.getColumn(filterType)?.setFilterValue(undefined)
        }
        
        setColumnFilters([])
        
        setFilterType(value)
        
        if (value) {
            table.getColumn(value)?.setFilterValue(undefined)
        }
    }

    const handleFilterValueChange = (value: string) => {
        if (!filterType) return
        
        const column = table.getColumn(filterType)
        if (column) {
            // Si la valeur est vide, supprimer le filtre pour afficher tous les employés
            // Sinon, appliquer le filtre
            column.setFilterValue(value === "" ? undefined : value)
        }
    }

    return (
        <>
            <div className="flex items-center py-4 justify-end w-full max-w-md gap-2">
                <Select value={filterType} onValueChange={handleFilterTypeChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black ">
                        {filters.map((filter) => (
                            <SelectItem key={filter.key} value={filter.key} className="cursor-pointer hover:bg-gray-100 text-sm font-medium">
                                {filter.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input
                    placeholder={filterType ? `Filter by ${filters.find(filter => filter.key === filterType)?.name}...` : "Select a filter type first"}
                    value={(filterType && table.getColumn(filterType)?.getFilterValue() as string) ?? ""}
                    onChange={(event) => handleFilterValueChange(event.target.value)}
                    className="max-w-sm"
                    disabled={!filterType}
                />
            </div>
            <div className="overflow-hidden rounded-md border">
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
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
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
            </div>
                <DataTablePagination table={table} />
      </>
  )
}