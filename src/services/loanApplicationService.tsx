import { APIClient } from "helpers/api_helper";
import {
    Loan,
    CreateLoanRequest,
    UpdateLoanRequest,
    ManualRepaymentRequest,
    LoanTopUpRequest,
    LoanStatement,
    LoanScheduleResponse,
    AllLoansResponse,
    SingleLoanResponse,
    LoanApplyResponse,
    TopUpLoanResponse
} from "../types/loanApplication";

const api = new APIClient();
const BASE_URL = "/api/loan";

export const LoanService = {
    getAllLoans: async (filters?: { status?: string; employee_id?: number }): Promise<Loan[]> => {
        const response: AllLoansResponse = await api.get(`${BASE_URL}/all`, { params: filters });
        return response.loans;
    },

    getLoanDetails: async (id: number): Promise<Loan> => {
        const response: SingleLoanResponse = await api.get(`${BASE_URL}/${id}`);
        return response.loan;
    },

    getLoanSchedule: async (id: number): Promise<LoanScheduleResponse> => {
        return await api.get(`${BASE_URL}/${id}/schedule`);
    },

    getLoanStatement: async (id: number): Promise<LoanStatement> => {
        return await api.get(`${BASE_URL}/${id}/statement`);
    },

    applyForLoan: async (payload: CreateLoanRequest): Promise<Loan> => {
        const response: LoanApplyResponse = await api.create(`${BASE_URL}/apply`, payload);
        return response.employeeLoan;
    },

    updateLoanApplication: async (id: number, payload: UpdateLoanRequest): Promise<Loan> => {
        const response: LoanApplyResponse = await api.update(`${BASE_URL}/update/${id}`, payload);
        return response.employeeLoan;
    },

    approveLoan: async (id: number): Promise<Loan> => {
        const response: SingleLoanResponse = await api.create(`${BASE_URL}/${id}/approve`, {});
        return response.loan;
    },

    rejectLoan: async (id: number): Promise<{ message: string; loan_id: number; status: string }> => {
        return await api.create(`${BASE_URL}/${id}/reject`, {});
    },

    recordRepayment: async (id: number, payload: ManualRepaymentRequest): Promise<{ 
        message: string; 
        transaction_id: number; 
        new_outstanding_balance: string 
    }> => {
        return await api.create(`${BASE_URL}/${id}/repay`, payload);
    },

    topUpLoan: async (id: number, payload: LoanTopUpRequest): Promise<TopUpLoanResponse> => {
        return await api.create(`${BASE_URL}/${id}/top-up`, payload);
    }
};