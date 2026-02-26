export interface Department {
  id: number;
  name: string;
  designation_count?: number;
  designations?: any[];
  employees?: any[];
  created_at: string;
  updated_at: string;
}

export interface DepartmentPayload {
  name: string;
}