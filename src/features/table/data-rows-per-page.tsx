import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import type { Table } from "@tanstack/react-table"

interface DataRowsPerPageProps<TData> {
    table: Table<TData>
}
export function DataRowsPerPage<TData>({ table }: DataRowsPerPageProps<TData>) {
    return (
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px] cursor-pointer">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="bg-white text-black">
              {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} className="cursor-pointer hover:bg-gray-100">
                  <span className="text-sm font-medium">{pageSize}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
    )
}