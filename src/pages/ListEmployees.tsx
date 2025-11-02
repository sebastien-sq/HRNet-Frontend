import { NavLink } from 'react-router'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { DataTable } from '@/features/table/data-table'
import { columns } from '@/features/table/columns'

export default function ListEmployees() {
    const employees = useSelector((state: RootState) => state.employees.list)
    console.log(employees)
    return (
        <main className="flex flex-col gap-4 justify-center items-center p-4 max-w-screen max-h-screen">
            <h1 className="text-2xl font-bold">List Employees</h1>
            <NavLink to="/add" className="text-blue-500">Add Employees</NavLink>
            <DataTable columns={columns} data={employees} />
        </main>
    )
}   