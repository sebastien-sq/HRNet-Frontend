import { NavLink } from 'react-router'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { DataTable } from '@/features/table/data-table'
import { columns } from '@/features/table/columns'
import { ArrowLeft } from 'lucide-react'

export default function ListEmployees() {
    const employees = useSelector((state: RootState) => state.employees.list)
    return (
        <main className="flex flex-col gap-4 justify-center items-center p-4 max-w-screen max-h-screen relative">
            <h1 className="text-2xl font-bold">List Employees</h1>
            <NavLink to="/add" className="text-blue-400 hover:text-blue-300 transition-all duration-300 absolute top-4 left-12 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Go Home
            </NavLink>
            <DataTable columns={columns} data={employees} />
        </main>
    )
}   