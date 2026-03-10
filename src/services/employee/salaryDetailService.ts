import { APIClient } from "../../helpers/api_helper";
import {
    SalaryDetail,
    CreateSalaryDetailPayload,
    UpdateSalaryDetailPayload
} from "../../types/employee/salaryDetail";

const api = new APIClient();
const BASE_URL = "/salary";

export const SalaryDetailService = {
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