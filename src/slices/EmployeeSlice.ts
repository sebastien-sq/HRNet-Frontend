import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Employee } from '../lib/types'

const initialState: Employee[] = []

const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        addEmployee: (state, action: PayloadAction<Employee>) => {
            state.push(action.payload)
        },
        filterEmployees: (state, action: PayloadAction<{ type: 'firstName' | 'lastName' | 'department', value: string }>) => {
            return state.filter(employee => employee[action.payload.type].toLowerCase().includes(action.payload.value.toLowerCase()))
        },
        sortEmployees: (state, action: PayloadAction<{ type: 'firstName' | 'lastName' | 'department', value: 'asc' | 'desc' }>) => {
            return state.sort((a, b) => {
                if (action.payload.value === 'asc') {
                    return a[action.payload.type].localeCompare(b[action.payload.type] as string)
                } else {
                    return b[action.payload.type].localeCompare(a[action.payload.type] as string)
                }
            })
        },
    }
})

export const { addEmployee } = employeesSlice.actions
export default employeesSlice.reducer