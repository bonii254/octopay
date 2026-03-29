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
    gender_restriction: "Male" | "Female" | "ALL";
    requires_documentation: boolean;
    validity_period_start: string | null;
    validity_period_end: string | null;
    policy_metadata: any;
}

export type CreateLeaveTypeRequest = Omit<LeaveType, "id">;
export type UpdateLeaveTypeRequest = Partial<CreateLeaveTypeRequest>;

