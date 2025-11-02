export interface Employee {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    startDate: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    department: string;
}

export interface FormData {
    disabled: boolean;
    error: string | null;
    success: boolean;
}