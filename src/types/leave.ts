export interface LeaveType {
    id: number;
    name: string;
    description: string;
    default_days: number;
    balanceable: boolean;
    carry_forward_allowed: boolean;
    max_carry_forward_days: number;
    accrual_enabled: boolean;
    accrual_rate: number;
    min_months_before_eligibility: number | null;
    gender_restriction: "Male" | "Female" | null;
    requires_documentation: boolean;
    validity_period_start: string | null;
    validity_period_end: string | null;
    policy_metadata: any;
}

export interface LeaveBalance {
    id: number;
    employee_id: number;
    leave_type_id: number;
    fiscal_year: number;
    opening_balance: number;
    balance_days: number;
    carried_forward: number;
    frozen: boolean;
    last_updated: string;
    employee_name?: string;
    leave_type_name?: string;
    remaining_days?: number;
}

export type CreateLeaveTypeRequest = Omit<LeaveType, "id">;
export type UpdateLeaveTypeRequest = Partial<CreateLeaveTypeRequest>;

export type CreateLeaveBalanceRequest = Omit<LeaveBalance, "id" | "last_updated" | "balance_days">;
export type UpdateLeaveBalanceRequest = Partial<CreateLeaveBalanceRequest>;