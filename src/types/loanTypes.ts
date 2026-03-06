export interface LoanType {
  id: number;
  name: string;
  interest_rate: number;
  max_tenure_months: number;
  max_amount_percentage: number;
  loans?: any[]; 
}
export interface LoanTypePayload extends Omit<LoanType, 'id' | 'loans'> {}
export type UpdateLoanTypeRequest = Partial<LoanTypePayload>;