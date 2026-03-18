export interface LeaveBalance {
  id: number;
  employee_id: number;
  leave_type_id: number;
  fiscal_year: number;

  opening_balance: number;
  carried_forward: number;
  balance_days: number;

  frozen: boolean;
  last_updated: string;

  employee_name?: string;
  leave_type_name?: string;
  employee_payroll?: string;
}

export interface CreateLeaveBalanceRequest {
  employee_id: number;
  leave_type_id: number;
  opening_balance?: number;
  carried_forward?: number;
}

export interface UpdateLeaveBalanceRequest {
  opening_balance?: number;
  carried_forward?: number;
  frozen?: boolean;
}

export interface RolloverRequest {
  target_year: number;
}