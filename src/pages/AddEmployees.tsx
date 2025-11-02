import { useState } from 'react';
import { NavLink } from 'react-router'
import { z } from 'zod'

const employeeSchema = z.object({
    firstName: z.string().min(1, { error: 'First name is required' }),
    lastName: z.string().min(1, { error: 'Last name is required' }),
    dateOfBirth: z.string().min(1, {error : 'Date of Birth is required'}),
    startDate: z.string().min(1, {error : 'Start Date is required'}),
    street: z.string().min(1, {error : 'Street is required'}),
    city: z.string().min(1, {error : 'City is required'}),
    state: z.string().min(1, {error : 'State is required'}),
    zipCode: z.string().min(1, {error : 'Zip Code is required'}),
    department: z.string().min(1, {error : 'Department is required'}),
})

export default function AddEmployees() {
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setDisabled(true);
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData);
        const validatedData = employeeSchema.safeParse(data);
        if (!validatedData.success) {
            console.error(validatedData.error);
            setError(validatedData.error.message);
            return;
        }
        console.log(validatedData.data);
        setDisabled(false);
        setSuccess(true);
    }
    return (
        <main className="flex flex-col gap-4 justify-center items-center p-12">
            <header className="flex flex-col gap-4 justify-between items-center">
                <h1 className="text-2xl font-bold">HRNet</h1>
                <NavLink to="/list" className="text-blue-500 hover:text-blue-700 ">View Current Employees</NavLink>
            </header>
            <div className="flex flex-col gap-4 w-full max-w-md mt-12">
                <h2 className="text-xl font-bold text-center">Add Employee</h2>
                <form onSubmit={handleSubmit} className="add-employee-form flex flex-col gap-4 justify-center items-center">
                    <div className="flex flex-col gap-4 border-2 border-gray-300 rounded-md p-4 w-full">
                        <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
                        <input type="text" id="firstName" placeholder="Bob" required />
                        <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
                        <input type="text" id="lastName" placeholder="Dylan" required />
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium cursor-pointer">Date of Birth</label>
                        <input type="date" id="dateOfBirth" placeholder="1990-01-01" required />
                        <label htmlFor="startDate" className="block text-sm font-medium cursor-pointer">Start Date</label>
                        <input type="date" id="startDate" placeholder="2025-01-01" required />
                    </div>
                    <div className="flex flex-col gap-4 border-2 border-gray-300 rounded-md p-4 w-full">
                        <label htmlFor="street" className="block text-sm font-medium">Street</label>
                        <input type="text" id="street" placeholder="123 Main St" required />
                        <label htmlFor="city" className="block text-sm font-medium">City</label>
                        <input type="text" id="city" placeholder="Anytown" required />
                        <label htmlFor="state" className="block text-sm font-medium">State</label>
                        <input type="text" id="state" placeholder="CA" required />
                        <label htmlFor="zipCode" className="block text-sm font-medium">Zip Code</label>
                        <input type="text" id="zipCode" placeholder="12345" required />

                    </div>
                    <div className="flex flex-col justify-center items-center gap-4 border-2 border-gray-300 rounded-md p-4 cursor-pointer w-full">
                        <label htmlFor="department" className="block text-sm font-medium">Department</label>
                        <select id="department" required>
                            <option value="1">Sales</option>
                            <option value="2">Marketing</option>
                            <option value="3">Engineering</option>
                            <option value="4">Human Resources</option>
                            <option value="5">Legal</option>
                        </select>
                    </div>
                    <button type="submit" disabled={disabled} className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-md mx-auto">Add Employee</button>
                </form> 
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">Employee added successfully</p>}
        </main>
    )
}