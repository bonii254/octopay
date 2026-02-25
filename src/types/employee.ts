export enum EmployeeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  TERMINATED = "TERMINATED",
  SUSPENDED = "SUSPENDED"
}


export interface Employee {
  id: number;
  company_id: number;
  user_id?: number | null;
  department_id?: number | null;
  designation_id?: number | null;
  shift_id?: number | null;

  employee_code: string;
  first_name: string;
  last_name?: string | null;
  national_id?: string | null;

  date_of_birth?: string | null;
  hire_date: string;
  termination_date?: string | null;

  status: EmployeeStatus;
  gender?: string | null;
  marital_status?: string | null;
  disability_status: boolean;

  created_at?: string;
  updated_at?: string;

  full_name?: string;
  company_name?: string | null;
  department_name?: string | null;
  designation_title?: string | null;
  shift_name?: string | null;

  has_user_account?: boolean;
  has_bank_details?: boolean;
}