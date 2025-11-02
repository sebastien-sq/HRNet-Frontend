import { NavLink } from 'react-router'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
export default function ListEmployees() {
    const employees = useSelector((state: RootState) => state.employees.list)
    console.log(employees)
    return (
        <div>
            <h1>List Employees</h1>
            <NavLink to="/add">Add Employees</NavLink>
        </div>
    )
}   