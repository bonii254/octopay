export interface Department {
  id: number;
  company_id: number;
  name: string;
  company_name?: string;
  designation_count?: number;
  company?: any[];
  designations?: any[];
  employees?: any[];
  created_at: string;
  updated_at: string;
}

export interface DepartmentPayload {
  name: string;
  compamy_id: number;
}