export type LoanStatus = 'PENDING' | 'APPROVED' | 'DISBURSED' | 'CLOSED' | 'REJECTED';
export type InterestType = 'FLAT' | 'REDUCING';
export type RepaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE';
export type RepaymentMethod = 'PAYROLL' | 'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY';

export type DecimalString = string;


export interface CreateLoanRequest {
  id?: number;
  employee_id: number;
  loan_type_id: number;
  principal_amount: DecimalString;
  tenure_months: number;
  interest_type: InterestType;
  interest_rate?: DecimalString;
}

export type UpdateLoanRequest = Partial<CreateLoanRequest>;

export interface ManualRepaymentRequest {
  amount: DecimalString;
  payment_method: RepaymentMethod;
  reference?: string;
  remarks?: string;
}

export interface LoanTopUpRequest {
  top_up_amount: DecimalString;
  tenure_months: number;
  interest_type: InterestType;
  interest_rate?: DecimalString;
}

export interface TopUpLoanResponse {
  message: string;
  old_loan_status: string;
  new_loan: Loan;
}

export interface Loan {
  id: number;
  employee_id: number;
  loan_type_id: number;
  principal_amount: DecimalString;
  interest_rate: DecimalString;
  tenure_months: number;
  interest_type: InterestType;
  start_date: string; 
  end_date: string | null;
  approved_by: number | null;
  status: LoanStatus;
  total_payable: DecimalString | null;
  outstanding_principal?: DecimalString;
}

export interface ScheduleRow {
  id: number;
  due_date: string;
  principal_component: DecimalString;
  interest_component: DecimalString;
  total_due: DecimalString;
  status: RepaymentStatus;
  paid_date?: string | null;
}

export interface LoanTransaction {
  id: number;
  date: string;
  amount: DecimalString;
  method: RepaymentMethod;
  reference: string;
}

export interface LoanStatement {
  summary: {
    loan_id: number;
    loan_type: string;
    principal_borrowed: DecimalString;
    interest_rate: string;
    start_date: string;
    status: LoanStatus;
    financials: {
      total_repayment_amount: DecimalString;
      total_amount_paid: DecimalString;
      total_balance_remaining: DecimalString;
      outstanding_principal_only: DecimalString;
      repayment_progress_percentage: number;
    };
  };
  recent_transactions: LoanTransaction[];
  upcoming_schedule: Array<{
    due_date: string;
    amount_due: DecimalString;
    status: RepaymentStatus;
    principal: DecimalString;
    interest: DecimalString;
  }>;
}

export interface AllLoansResponse {
  loans: Loan[];
}

export interface SingleLoanResponse {
  loan: Loan;
}

export interface LoanApplyResponse {
  message: string;
  employeeLoan: Loan;
}

export interface LoanScheduleResponse {
  loan_id: number;
  schedule: ScheduleRow[];
}