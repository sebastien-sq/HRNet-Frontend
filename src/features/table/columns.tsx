"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Employee } from '@/lib/types'
import { format } from 'date-fns/format'
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export const columns: ColumnDef<Employee>[] = [
    {
        accessorKey: "firstName",
        header: ({ column }) => {
            return <div className="flex items-center gap-2">
                First Name
                <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <ChevronUp className={cn("size-4", column.getIsSorted() === "asc" ? "rotate-180" : "")} />
                </Button>
            </div>
        },
    },
    {
        accessorKey: "lastName",
        header: ({ column }) => {
            return <div className="flex items-center gap-2">
                Last Name
                <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <ChevronUp className={cn("size-4", column.getIsSorted() === "asc" ? "rotate-180" : "")} />
                </Button>
            </div>
        },
    },
    {
        accessorKey: "startDate",
        header: ({ column }) => {
            return <div className="flex items-center gap-2">
                Start Date
                <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <ChevronUp className={cn("size-4", column.getIsSorted() === "asc" ? "rotate-180" : "")} />
                </Button>
            </div>
        },
        cell: ({ row }) => {
            return <div>{format(new Date(row.original.startDate), 'dd/MM/yyyy')}</div>
        }
    },
    {
        accessorKey: "department",
        header: ({ column }) => {
            return <div className="flex items-center gap-2">
                Department
                <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <ChevronUp className={cn("size-4", column.getIsSorted() === "asc" ? "rotate-180" : "")} />
                </Button>
            </div>
        },
    },
    {
        accessorKey: "dateOfBirth",
        header: ({ column }) => {
            return <div className="flex items-center gap-2">
                Date of Birth
                <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <ChevronUp className={cn("size-4", column.getIsSorted() === "asc" ? "rotate-180" : "")} />
                </Button>
            </div>
        },
        cell: ({ row }) => {
            return <div>{format(new Date(row.original.dateOfBirth), 'dd/MM/yyyy')}</div>
        }
    },
    {
        accessorKey: "street",
        header: ({ column }) => {
            return <div className="flex items-center gap-2">
                Street
                <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <ChevronUp className={cn("size-4", column.getIsSorted() === "asc" ? "rotate-180" : "")} />
                </Button>
            </div>
        },
    },
    {
        accessorKey: "city",
        header: ({ column }) => {
            return <div className="flex items-center gap-2">
                City
                <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <ChevronUp className={cn("size-4", column.getIsSorted() === "asc" ? "rotate-180" : "")} />
                </Button>
            </div>
        },
    },
    {
        accessorKey: "state",
        header: ({ column }) => {
            return <div className="flex items-center gap-2">
                State
                <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <ChevronUp className={cn("size-4", column.getIsSorted() === "asc" ? "rotate-180" : "")} />
                </Button>
            </div>
        },
    },
    {
        accessorKey: "zipCode",
        header: ({ column }) => {
            return <div className="flex items-center gap-2">
                Zip Code
                <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <ChevronUp className={cn("size-4", column.getIsSorted() === "asc" ? "rotate-180" : "")} />
                </Button>
            </div>
        },
    }
]