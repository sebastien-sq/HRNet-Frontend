import { NavLink } from 'react-router'

export default function AddEmployees() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted');
    }
    return (
        <main className="flex flex-col gap-4 justify-center items-center p-12">
            <header className="flex flex-col gap-4 justify-between items-center">
                <h1 className="text-2xl font-bold">HRNet</h1>
                <NavLink to="/list" className="text-blue-500 hover:text-blue-700">View Current Employees</NavLink>
            </header>
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">Add Employee</h2>
                <form onSubmit={handleSubmit} className="add-employee-form flex flex-col gap-4 justify-center items-center">
                    <div className="flex flex-col gap-4 border-2 border-gray-300 rounded-md p-4 w-full">
                        <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
                        <input type="text" id="firstName" placeholder="Bob" />
                        <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
                        <input type="text" id="lastName" placeholder="Dylan" />
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium cursor-pointer">Date of Birth</label>
                        <input type="date" id="dateOfBirth" placeholder="1990-01-01" />
                        <label htmlFor="startDate" className="block text-sm font-medium cursor-pointer">Start Date</label>
                        <input type="date" id="startDate" placeholder="2025-01-01" />
                    </div>
                    <div className="flex flex-col gap-4 border-2 border-gray-300 rounded-md p-4 w-full">
                        <label htmlFor="street" className="block text-sm font-medium">Street</label>
                        <input type="text" id="street" placeholder="123 Main St" />
                        <label htmlFor="city" className="block text-sm font-medium">City</label>
                        <input type="text" id="city" placeholder="Anytown" />
                        <label htmlFor="state" className="block text-sm font-medium">State</label>
                        <input type="text" id="state" placeholder="CA" />
                        <label htmlFor="zipCode" className="block text-sm font-medium">Zip Code</label>
                        <input type="text" id="zipCode" placeholder="12345" />

                    </div>
                    <div className="flex flex-col justify-center items-center gap-4 border-2 border-gray-300 rounded-md p-4 cursor-pointer w-full">
                        <label htmlFor="department" className="block text-sm font-medium">Department</label>
                        <select id="department">
                            <option value="1">Sales</option>
                            <option value="2">Marketing</option>
                            <option value="3">Engineering</option>
                            <option value="4">Human Resources</option>
                            <option value="5">Legal</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-md mx-auto">Add Employee</button>
                </form> 
            </div>
        </main>
    )
}