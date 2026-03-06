import { APIClient } from "helpers/api_helper";
import {
    LoanType,
    LoanTypePayload,
    UpdateLoanTypeRequest
} from "../types/loanTypes"

const api = new APIClient()

const BASE_URL = "/loantype"

export const LoanTypeService = {
    getAllLoanTypes: async (): Promise<LoanType[]> => {
            const response = await api.get(`${BASE_URL}/all`);
            return response
    },

    getLoanById: async (id: number): Promise<LoanType> => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response;
    },

    createLoanType: async (payload: LoanTypePayload): Promise<LoanType> => {
        const response = await api.create(`${BASE_URL}/register`, payload)
        return response.Loantype;
    },

    updateLoanType: async (id: number, payload: UpdateLoanTypeRequest): Promise<LoanType> => {
        const response = await api.update(`${BASE_URL}/${id}`, payload);
        return response.loan_type;
    },
    
    deleteLoanType: async (id: number): Promise<string> => {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.message;
    },
}