import { EmployeeBase } from "./employee/employeebase";
import { SalaryComponent } from "./salaryComponent";

export interface EmployeeRecurringComponent {
  id: number;
  employee_id: number;
  component_id: number;
  amount: number;
  effective_from: string;
  effective_to: string | null;
  employee?: EmployeeBase; 
  component?: SalaryComponent;
}

export interface CreateRecurringComponentPayload {
  employee_id: number;
  component_id: number;
  amount: number;
  effective_from: string;
  effective_to?: string | null;
}

export interface UpdateRecurringComponentPayload {
  amount?: number;
  effective_from?: string;
  effective_to?: string | null;
}

export type MatrixRow = Record<string, any> & { 
  employee_id: number; employee_name: string; employee_code: string; };