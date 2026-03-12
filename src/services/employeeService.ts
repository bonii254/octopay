import { APIClient } from "../helpers/api_helper";
import { 
  EmployeeBase, 
  CreateEmployeePayload, UpdateEmployeePayload
} from "../types/employee/employeebase";


const api = new APIClient();
const BASE_URL = "/employee";

export const employeeService = {
    getAll: async (params?: Record<string, unknown>): Promise<EmployeeBase[]> => {
      const response = await api.get(`${BASE_URL}/all`, { params });
      return response.employees;
    },

    getById: async (id: number): Promise<EmployeeBase> => {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.employee;
    },

    create: async (data: CreateEmployeePayload): Promise<EmployeeBase> => {
      const response = await api.create(`${BASE_URL}/register`, data);
      return response.employee;
    },

    update: async (
        id: number, 
        data: Partial<UpdateEmployeePayload>
    ): Promise<EmployeeBase> => {
      const response = await api.put(`${BASE_URL}/update/${id}`, data);
      return response.employee;
    },
    remove: async (id: number): Promise<void> => {
      await api.delete(`${BASE_URL}/delete/${id}`);
    },
};