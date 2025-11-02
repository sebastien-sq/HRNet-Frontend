"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Employee } from '@/lib/types'
import { format } from 'date-fns/format'
import { DataTableColumnHeader } from "./data-table-column-header"

export const columns: ColumnDef<Employee>[] = [
    {
        accessorKey: "firstName",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="First Name" />
        },
    },
    {
        accessorKey: "lastName",
        header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Last Name" />
        },
    },
    {
        accessorKey: "startDate",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Start Date" />
        },
        cell: ({ row }) => {
            return <div>{format(new Date(row.original.startDate), 'dd/MM/yyyy')}</div>
        }
    },
    {
        accessorKey: "department",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Department" />
        },
    },
    {
        accessorKey: "dateOfBirth",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Date of Birth" />
        },
        cell: ({ row }) => {
            return <div>{format(new Date(row.original.dateOfBirth), 'dd/MM/yyyy')}</div>
        }
    },
    {
        accessorKey: "street",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Street" />
        },
    },
    {
        accessorKey: "city",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="City" />
        },
    },
    {
        accessorKey: "state",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="State" />
        },
    },
    {
        accessorKey: "zipCode",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Zip Code" />
        },
    }
]