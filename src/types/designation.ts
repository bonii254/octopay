export interface Designation {
    id: number;
    department_id: number;
    title: string;

    department_name?: string | null;

    employee_count?: number; 
    created_at?: string;    
    updated_at?: string;    
}

export interface DesignationPayload {
    department_id: number;
    title: string;
}