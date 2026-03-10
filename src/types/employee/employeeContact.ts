export interface EmployeeContact {
    id: number;
    employee_id: number;
    phone: string;
    email: string;
    address: string;
    employee_name?: string | null;
}

export interface CreateEmployeeContactPayload {
    employee_id: number;
    phone: string;
    email: string;
    address: string;
}

export type UpdateEmployeeContactPayload = Partial<CreateEmployeeContactPayload>;