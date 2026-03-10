import { APIClient } from "../../helpers/api_helper";
import {
    EmployeeBase,
    CreateEmployeePayload,
    UpdateEmployeePayload
} from "../../types/employee/employeebase";


const api = new APIClient();    

const BASE_URL = "/employee";


export const EmployeeBaseService = {
    getAllEmployees: async (): Promise<EmployeeBase[]> => {
        const response = await api.get(`${BASE_URL}/all`);
        return response.employees;
    },

    createEmployee: async (payload: CreateEmployeePayload): Promise<EmployeeBase> => {
        const response = await api.create(`${BASE_URL}/register`, payload);
        return response.employee;
    },  

    updateEmployee: async (id: number, payload: UpdateEmployeePayload): Promise<EmployeeBase> => {
        const response = await api.update(`${BASE_URL}/update/${id}`, payload);
        return response.employee;
    },

    deleteEmployee: async (id: number): Promise<string> => {
        const response = await api.delete(`${BASE_URL}/delete/${id}`);
        return response.message;
    },

    search: async (query: string): Promise<EmployeeBase[]> => {
        const response = await api.get(`${BASE_URL}/all`, { params: { q: query } });
        return response.employees;
  },
};