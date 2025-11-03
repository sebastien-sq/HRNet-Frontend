import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { filters } from "@/utils/variables"
import { Input } from "@/components/ui/input"
import type { Table } from "@tanstack/react-table"

interface DataSearchByFiltersProps<TData> {
    table: Table<TData>
    filterType: string
    handleFilterTypeChange: (value: string) => void
    handleFilterValueChange: (value: string) => void
}
export function DataSearchByFilters<TData>({ table, filterType, handleFilterTypeChange, handleFilterValueChange }: DataSearchByFiltersProps<TData>) {
    return (
        <>
        <Select value={filterType} onValueChange={handleFilterTypeChange}>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Search by..." />
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
        placeholder={filterType ? `Search by ${filters.find(filter => filter.key === filterType)?.name}...` : "Select a search type first"}
        value={(filterType && table.getColumn(filterType)?.getFilterValue() as string) ?? ""}
        onChange={(event) => handleFilterValueChange(event.target.value)}
        className="max-w-sm"
        disabled={!filterType}
    />
    </>
    )
}