import { NavLink } from 'react-router'

export default function ListEmployees() {
    return (
        <div>
            <h1>List Employees</h1>
            <NavLink to="/add">Add Employees</NavLink>
        </div>
    )
}   