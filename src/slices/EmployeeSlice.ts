import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Employee } from '../lib/types'

interface EmployeesState {
    list: Employee[]
}

const initialState: EmployeesState = {
    list: []
}

const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        addEmployee: (state, action: PayloadAction<Employee>) => {
            // Ajouter le nouvel employé au tableau existant
            state.list.push({
                ...action.payload,
            })
        },
        filterEmployees: (state, action: PayloadAction<{ type: 'firstName' | 'lastName' | 'department', value: string }>) => {
            state.list = state.list.filter(employee => employee[action.payload.type].toLowerCase().includes(action.payload.value.toLowerCase()))
        },
        sortEmployees: (state, action: PayloadAction<{ type: 'firstName' | 'lastName' | 'department', value: 'asc' | 'desc' }>) => {
            state.list.sort((a, b) => {
                if (action.payload.value === 'asc') {
                    return a[action.payload.type].localeCompare(b[action.payload.type] as string)
                } else {
                    return b[action.payload.type].localeCompare(a[action.payload.type] as string)
                }
            })
        },
    }
})

export const { addEmployee, filterEmployees, sortEmployees } = employeesSlice.actions
export default employeesSlice.reducer