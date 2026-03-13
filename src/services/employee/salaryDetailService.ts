import { APIClient } from "../../helpers/api_helper";
import {
    SalaryDetail,
    CreateSalaryDetailPayload,
    UpdateSalaryDetailPayload
} from "../../types/employee/salaryDetail";

const api = new APIClient();
const BASE_URL = "/salarydetails";

export const SalaryDetailService = {
    getAllSalaryDetails: async (): Promise<SalaryDetail[]> => {
      const response = await api.get(`${BASE_URL}`); 
      return response.salary_details;
    },
    
    getSalaryDetailsById: async (id: number): Promise<SalaryDetail> => {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.salary_detail;
    },

    createSalaryDetail: async (payload: CreateSalaryDetailPayload): Promise<SalaryDetail> => {
        const response = await api.create(`${BASE_URL}/register`, payload);
        return response.salary_detail;
    },

    updateSalaryDetail: async (id: number, payload: UpdateSalaryDetailPayload): Promise<SalaryDetail> => {
        const response = await api.update(`${BASE_URL}/update/${id}`, payload);
        return response.salary_detail;
    },

    getSalaryByEmployee: async (employeeId: number): Promise<SalaryDetail> => {
        const response = await api.get(`${BASE_URL}/employee/${employeeId}`);
        return response.salary_detail;
    }
};