import { APIClient } from "../../helpers/api_helper";
import {
    BankDetail,
    CreateBankDetailPayload,
    UpdateBankDetailPayload
} from "../../types/employee/bankDetail";

const api = new APIClient();
const BASE_URL = "/employeebankdetail";

export const BankDetailService = {
    getAllBankDetails: async (): Promise<BankDetail[]> => {
      const response = await api.get("/employeebankdetails"); 
      return response.employee_bank_details;
    },
    
    getBankDetailsById: async (id: number): Promise<BankDetail> => {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.bank_detail;
    },
    
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