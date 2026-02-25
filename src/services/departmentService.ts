import { APIClient } from "../helpers/api_helper";
import { Department, DepartmentPayload } from "../types/department";


const api = new APIClient();
const BASE_URL = "/department";

export const departmentService = {
    getAll: async (): Promise<Department[]> => {
      const response = await api.get(`${BASE_URL}/all`);
      return response.departments;
    },

    getById: async (id: number): Promise<Department> => {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.department;
    },

    create: async (payload: DepartmentPayload): Promise<Department> => {
      const response = await api.create(`${BASE_URL}/register`, payload);
      return response.department;
    },

    update: async (
      id: number, 
      payload: Partial<DepartmentPayload>
    ): Promise<Department> => {
      const response = await api.put(`${BASE_URL}/update/${id}`, payload);
      return response.department;
    },

    remove: async (id: number): Promise<string> => {
      const response = await api.delete(`${BASE_URL}/delete/${id}`);
      return response.message;
    },
};