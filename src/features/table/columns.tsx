"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Employee } from '@/lib/types'
import { format } from 'date-fns/format'

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      return <div>{format(new Date(row.original.startDate), 'dd/MM/yyyy')}</div>
    }
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
    cell: ({ row }) => {
      return <div>{format(new Date(row.original.dateOfBirth), 'dd/MM/yyyy')}</div>
    }
  },
  {
    accessorKey: "street",
    header: "Street",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "zipCode",
    header: "Zip Code",
  }
]