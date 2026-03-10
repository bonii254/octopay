export interface BankDetail {
    id: number;
    employee_id: number;
    bank_name: string;
    bank_code: string;
    branch_code: string;
    swift_code?: string | null;
    account_number: string;
    employee_name?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface CreateBankDetailPayload {
    employee_id: number;
    bank_name: string;
    bank_code: string;
    branch_code: string;
    swift_code?: string | null;
    account_number: string;
}

export type UpdateBankDetailPayload = Partial<CreateBankDetailPayload>;