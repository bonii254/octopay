import { APIClient } from "../helpers/api_helper";
import {
    SalaryComponent,
    CreateSalaryComponentRequest,
    UpdateSalaryComponentRequest
} from "../types/salaryComponent";


const api = new APIClient();    

const BASE_URL = "/salary-components";


export const SalaryComponentService = {
    getAllComponents: async (): Promise<SalaryComponent[]> => {
        const response = await api.get(`${BASE_URL}/all`);
        return response.component;
    },

    getComponentById: async (id: number): Promise<SalaryComponent> => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.component;
    },

    createComponent: async (payload: CreateSalaryComponentRequest): Promise<SalaryComponent> => {
        const response = await api.create(`${BASE_URL}/register`, payload);
        return response.component;
    },  

    updateComponent: async (id: number, payload: UpdateSalaryComponentRequest): Promise<SalaryComponent> => {
        const response = await api.update(`${BASE_URL}/update/${id}`, payload);
        return response.component;
    },

    deleteComponent: async (id: number): Promise<string> => {
        const response = await api.delete(`${BASE_URL}/delete/${id}`);
        return response.message;
    },

    search: async (query: string): Promise<SalaryComponent[]> => {
        const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
        return response.component;
  },
};
