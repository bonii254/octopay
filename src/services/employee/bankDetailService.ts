import { APIClient } from "../../helpers/api_helper";
import {
    BankDetail,
    CreateBankDetailPayload,
    UpdateBankDetailPayload
} from "../../types/employee/bankDetail";

const api = new APIClient();
const BASE_URL = "/bank";

export const BankDetailService = {
    createBankDetail: async (payload: CreateBankDetailPayload): Promise<BankDetail> => {
        const response = await api.create(`${BASE_URL}/register`, payload);
        return response.bank_detail;
    },

    updateBankDetail: async (id: number, payload: UpdateBankDetailPayload): Promise<BankDetail> => {
        const response = await api.update(`${BASE_URL}/update/${id}`, payload);
        return response.bank_detail;
    },

    getBankDetailByEmployee: async (employeeId: number): Promise<BankDetail> => {
        const response = await api.get(`${BASE_URL}/employee/${employeeId}`);
        return response.bank_detail;
    }
};