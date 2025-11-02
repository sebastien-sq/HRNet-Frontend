import { useState } from 'react';
import { NavLink } from 'react-router'
import { z } from 'zod'
import { addEmployee } from '../slices/EmployeeSlice'
import { useDispatch, useSelector } from 'react-redux'
import { departments, states } from '../utils/variables'
import SimpleModal from '@sebastien-sq/react-simple-modal'
import type { RootState } from '../store/store'
import type { Employee, FormData } from '../lib/types';
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


// Zod schema & date checks
const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
const today = new Date();
const createEmployeeSchema = (existingEmployees: Employee[]) => {
    return z.object({
        firstName: z.string().min(2, { message: 'First name is required' }),
        lastName: z.string().min(2, { message: 'Last name is required' }),
        dateOfBirth: z.string().min(1, { message: 'Date of Birth is required' }).refine(
            (val) => {
                const birthDate = new Date(val);
                return birthDate <= eighteenYearsAgo;
            },
            { message: 'Employee must be at least 18 years old' }
        ),
        startDate: z.string().min(1, { message: 'Start Date is required' }),
        street: z.string().min(2, { message: 'Street is required' }),
        city: z.string().min(2, { message: 'City is required' }),
        state: z.string().refine((val: string) => states.some(state => state.name === val), { message: 'State is required' }),
        zipCode: z.string().min(5, { message: 'Zip Code is required' }),
        department: z.string().refine((val: string) => ['Sales', 'Marketing', 'Engineering', 'Human Resources', 'Legal'].includes(val), { message: 'Department is required' }),
    }).refine(
        (data) => {
            // Vérifier que la date de début est après la date de naissance
            const birthDate = new Date(data.dateOfBirth);
            const startDate = new Date(data.startDate);
            return startDate > birthDate;
        },
        {
            message: 'Start date must be after date of birth',
            path: ['startDate'], // Indique que l'erreur concerne le champ startDate
        }
    ).refine(
        (data) => {
            // Vérifier que l'employé n'existe pas déjà dans le store
            return !existingEmployees.some((employee: Employee) =>
                employee.firstName === data.firstName &&
                employee.lastName === data.lastName &&
                employee.dateOfBirth === data.dateOfBirth &&
                employee.startDate === data.startDate &&
                employee.street === data.street &&
                employee.city === data.city &&
                employee.state === data.state &&
                employee.zipCode === data.zipCode &&
                employee.department === data.department
            );
        },
        {
            message: 'Employee already exists',
            path: ['firstName'],
        }
    );
}

export default function AddEmployees() {
    const [formData, setFormData] = useState<FormData>({
        disabled: false,
        error: null,
        success: false,
    });
    const existingEmployees = useSelector((state: RootState) => state.employees.list) as Employee[];
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormData({
            disabled: true,
            error: null,
            success: false,
        });
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData);

        const employeeSchema = createEmployeeSchema(existingEmployees);
        const validatedData = employeeSchema.safeParse(data);

        if (!validatedData.success) {
            console.error(validatedData.error);
            const firstError = validatedData.error.issues[0]?.message;
            setFormData({
                disabled: false,
                success: false,
                error: firstError as string || 'Validation error',
            });
            return;
        }
        dispatch(addEmployee({
            ...validatedData.data,
        }));
        setFormData({
            disabled: false,
            error: null,
            success: true,
        });
        setIsModalOpen(true);

    }
    return (
        <main className="flex flex-col gap-4 justify-center items-center p-4 max-w-screen max-h-screen">
            <header className="flex flex-col gap-4 justify-between items-center">
                <h1 className="text-2xl font-bold">HRNet</h1>
                <NavLink to="/list" className="text-blue-400 hover:text-blue-300 transition-all duration-300 ">View Current Employees</NavLink>
            </header>
            <div className="flex flex-col gap-4 w-full max-w-md mt-4">
                <h2 className="text-xl font-bold text-center">Add Employee</h2>
                <form onSubmit={handleSubmit} className="add-employee-form flex flex-col gap-4 justify-center items-center">
                    <div className="flex flex-col gap-4 border-2 border-gray-300 rounded-md p-4 w-full">
                        <div className="flex">
                            <div className="flex flex-col w-1/2">
                                <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
                                <input type="text" id="firstName" name="firstName" placeholder="Bob" required />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
                                <input type="text" id="lastName" name="lastName" placeholder="Dylan" required />
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex flex-col w-1/2">
                                <label htmlFor="dateOfBirth" className="block text-sm font-medium cursor-pointer">Date of Birth</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    placeholder="1990-01-01"
                                    className="w-3/4"
                                    max={eighteenYearsAgo.toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label htmlFor="startDate" className="block text-sm font-medium cursor-pointer">Start Date</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    placeholder="2025-01-01"
                                    className="w-3/4"
                                    max={today.toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 border-2 border-gray-300 rounded-md p-4 w-full">
                        <div className="flex">
                            <div className="flex flex-col w-1/2">
                                <label htmlFor="street" className="block text-sm font-medium">Street</label>
                                <input type="text" id="street" name="street" placeholder="123 Main St" required />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label htmlFor="city" className="block text-sm font-medium">City</label>
                                <input type="text" id="city" name="city" placeholder="Anytown" required />
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex flex-col w-1/2">
                                <label htmlFor="state" className="block text-sm font-medium">State</label>
                                <Select name="state" required>
                                    <SelectTrigger className="w-3/4 border-none cursor-pointer">
                                        <SelectValue placeholder="Select a state" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white text-black w-3/4">
                                        {states.map((state) => (
                                            <SelectItem value={state.name} className="text-black cursor-pointer hover:bg-gray-100" key={state.name}>{state.name}</SelectItem>
                                        ))}   
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label htmlFor="zipCode" className="block text-sm font-medium">Zip Code</label>
                                <input type="text" id="zipCode" name="zipCode" placeholder="12345" required />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col  gap-4 border-2 border-gray-300 rounded-md p-4 cursor-pointer w-full">
                        <label htmlFor="department" className="block text-sm font-medium">Department</label>
                        <Select name="department" required>
                            <SelectTrigger className="w-full border-none cursor-pointer">
                                <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-black">
                                {departments.map((department: string) => (
                                    <SelectItem value={department} className="text-black cursor-pointer hover:bg-gray-100" key={department}>{department}</SelectItem>
                                ))} 
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" disabled={formData.disabled} variant="outline" className="cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md mx-auto">Save</Button>
                </form>
            </div>
            {formData.error && <p className="text-red-500">{formData.error}</p>}
            {formData.success && <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Employee added successfully !" message="You can see the employee in the list page !" type="success" />}
        </main>
    )
}