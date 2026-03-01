import { APIClient } from "../helpers/api_helper";
import {
    SalaryComponent,
    CreateSalaryComponentRequest,
    UpdateSalaryComponentRequest
} from "../types/salaryComponent";


const api = new APIClient();    

const BASE_URL = "/api/salary-components";


export const SalaryComponentService = {
    getAllComponents: async (): Promise<SalaryComponent[]> => {
        const response = await api.get(`${BASE_URL}/all`);
        return response.data;
    },

    getComponentById: async (id: number): Promise<SalaryComponent> => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    createComponent: async (payload: CreateSalaryComponentRequest): Promise<SalaryComponent> => {
        const response = await api.create(`${BASE_URL}/register`, payload);
        return response.data;
    },  

    updateComponent: async (id: number, payload: UpdateSalaryComponentRequest): Promise<SalaryComponent> => {
        const response = await api.update(`${BASE_URL}/update/${id}`, payload);
        return response.data;
    },

    deleteComponent: async (id: number): Promise<string> => {
        const response = await api.delete(`${BASE_URL}/delete/${id}`);
        return response.message;
    },

    search: async (query: string): Promise<SalaryComponent[]> => {
        const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
        return response.data;
  },
};
