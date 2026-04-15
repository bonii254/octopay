export interface CoolerAssignment {
  id: string;
  cooler_id: string;
  user_id: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  user_name?: string;
  cooler_name?: string;
  user_payroll_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAssignmentPayload {
  user_id: string;
  cooler_id: string;
}

export interface AssignmentResponse {
  assignment: CoolerAssignment;
}

export interface AssignmentHistoryResponse {
  history: CoolerAssignment[];
}

export interface AllAssignmentsResponse {
  assignments: CoolerAssignment[];
}