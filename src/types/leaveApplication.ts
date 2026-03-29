export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type LeavePortion = 'FULL' | 'AM' | 'PM';
export type AlertLevel = 'NORMAL' | 'WARNING' | 'CRITICAL';


export interface IApprovalStep {
  user_id: number;
  action: 'CREATED' | 'APPROVED' | 'REJECTED';
  timestamp: string;
}

export interface ILeaveApplication {
  id: number;

  employee_id: number;
  leave_type_id: number;

  start_date: string;
  end_date: string;
  start_portion: LeavePortion;
  end_portion: LeavePortion;

  total_days: number;
  reason: string | null;

  status: LeaveStatus;

  applied_on: string;

  approved_by: number | null;
  approved_on: string | null;

  rejection_reason: string | null;

  approval_chain: IApprovalStep[];

  document_urls: string[];

  employee_payroll?: string;
  employee_name?: string;
  leave_type_name?: string;
}


export interface ICreateLeavePayload {
  employee_id: number;
  leave_type_id: number;

  start_date: string;
  end_date: string;

  start_portion?: LeavePortion;
  end_portion?: LeavePortion;

  reason?: string | null;

  document_urls?: string[];
}

export interface IUpdateLeavePayload {
  leave_type_id?: number;

  start_date?: string;
  end_date?: string;

  start_portion?: LeavePortion;
  end_portion?: LeavePortion;

  reason?: string | null;

  document_urls?: string[];
}

export interface IPreviewLeavePayload {
  employee_id: number;
  leave_type_id: number;

  start_date: string;
  end_date: string;

  start_portion?: LeavePortion;
  end_portion?: LeavePortion;
}

export interface ILeavePreviewResponse {
  total_days: number;

  database_balance: number;
  pending_deductions: number;

  effective_remaining_before: number;
  effective_remaining_after: number;

  holidays_in_range: string[];

  conflicts: Array<{
    start: string;
    end: string;
    status: LeaveStatus;
  }>;
}

export interface IRejectLeavePayload {
  reason: string;
}

export interface ILeaveIntelligenceData {
  conflict_count: number;

  conflicts: Array<{
    employee_name: string;
    status: LeaveStatus;
    dates: string;
    total_days: number;
  }>;

  department_size: number;

  remaining_capacity_percent: number;
  alert_level: AlertLevel;

  projected_headcount: number;
}

export interface ILeaveIntelligenceResponse {
  data: ILeaveIntelligenceData;
}

export interface ILeaveIntelligenceFullResponse {
  status: 'success';
  leave_id: number;
  data: ILeaveIntelligenceData;
}

export interface INotification {
  id: number;
  user_id: number;

  title: string;
  message: string;

  is_read: boolean;
  created_at: string;
}

export interface IApiResponse<T> {
  message?: string;
  data: T;
}

export interface IApiErrorResponse {
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PublicHoliday {
  id: number;
  name: string;
  holiday_date: string; 
  is_recurring: boolean;
  
  created_at?: string; 
  updated_at?: string; 
}