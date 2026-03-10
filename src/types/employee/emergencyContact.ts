export interface EmergencyContact {
    id: number;
    employee_id: number;
    name: string;
    relationship: string;
    phone: string;
    alternate_phone?: string | null;
    employee_name?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface CreateEmergencyContactPayload {
    employee_id: number;
    name: string;
    relationship: string;
    phone: string;
    alternate_phone?: string | null;
}

export type UpdateEmergencyContactPayload = Partial<CreateEmergencyContactPayload>;