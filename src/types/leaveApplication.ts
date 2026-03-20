export enum LeaveStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled"
}

export enum NotificationType {
  LEAVE_STATUS = "LEAVE_STATUS",
  LEAVE_REQUEST = "LEAVE_REQUEST",
  PAYROLL = "PAYROLL",
  SYSTEM = "SYSTEM",
  SECURITY = "SECURITY"
}

export interface ApprovalChainEntry {
  user: string;
  role: string;
  action: string;
  note: string | null;
  timestamp: string;
}

export interface ContextualIntelligence {
  conflicts: number;
  conflict_details: string[];
  department_size: number;
}

export interface LeaveBurnRate {
  status: "CRITICAL" | "HEALTHY";
  earned_to_date: number;
  projected_year_end: number;
}

export interface LeaveApplication {
  id: number;
  employee_id: number;
  leave_type_id: number;
  
  start_date: string; 
  end_date: string;   
  total_days: number;
  reason?: string | null;
  
  status: LeaveStatus;
  applied_on: string; 
  
  approved_by?: number | null;
  approved_on?: string | null;
  reviewed_by?: number | null;
  reviewed_on?: string | null;
  rejection_reason?: string | null;
  
  document_urls: string[];
  approval_chain: ApprovalChainEntry[];
  is_deleted: boolean;

  employee_name?: string | null;
  leave_type_name?: string | null;
  documents?: string[];
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: NotificationType;
  link?: string | null;
  is_read: boolean;
  read_at?: string | null;
  created_at: string; 
}

export interface PublicHoliday {
  id: number;
  name: string;
  holiday_date: string; 
  is_recurring: boolean;
  
  created_at?: string; 
  updated_at?: string; 
}