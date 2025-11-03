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

import { useState } from "react"
import { DataTablePagination } from "./data-table-pagination"
import { DataRowsPerPage } from "./data-rows-per-page"
import { DataSearchByFilters } from "./data-search-by-filters"

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
            <div className="flex items-center py-4 justify-between w-full max-w-5xl gap-2">
                <div className="flex items-center gap-2">
                    <DataRowsPerPage table={table} />
                </div>
                <div className="flex items-center gap-2">
                    <DataSearchByFilters table={table} filterType={filterType} handleFilterTypeChange={handleFilterTypeChange} handleFilterValueChange={handleFilterValueChange} />
                </div>
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