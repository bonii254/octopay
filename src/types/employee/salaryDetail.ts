export interface SalaryDetail {
    id: number;
    employee_id: number;
    basic_salary: number;
    kra_pin?: string | null;
    nssf_number?: string | null;
    nhif_number?: string | null;
    is_tax_exempt: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CreateSalaryDetailPayload {
    employee_id: number;
    basic_salary: number;
    kra_pin?: string | null;
    nssf_number?: string | null;
    nhif_number?: string | null;
    is_tax_exempt: boolean;
}

export type UpdateSalaryDetailPayload = Partial<CreateSalaryDetailPayload>;