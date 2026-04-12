import { APIClient } from "../helpers/api_helper";
import {
  EmployeeRecurringComponent,
  CreateRecurringComponentPayload,
  UpdateRecurringComponentPayload
} from "../types/recurringComponents";

const api = new APIClient();

const BASE_URL = "/recurring-components";

export const EmployeeRecurringComponentService = {
  getAll: async (): Promise<EmployeeRecurringComponent[]> => {
    const response = await api.get(`${BASE_URL}/all`);
    return response.recurring_components; 
  },

  getMatrix: async (employeeId?: number): Promise<any[]> => {
    const params = employeeId ? { employee_id: employeeId } : {};
    const response = await api.get(`${BASE_URL}/matrix`, params);
    return response.matrix;
  },

  getById: async (id: number): Promise<EmployeeRecurringComponent> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response; 
  },

  create: async (
    payload: CreateRecurringComponentPayload
  ): Promise<EmployeeRecurringComponent> => {
    const response = await api.create(`${BASE_URL}/register`, payload);
    return response.recurring_component; 
  },

  update: async (
    id: number,
    payload: UpdateRecurringComponentPayload
  ): Promise<EmployeeRecurringComponent> => {
    const response = await api.update(`${BASE_URL}/update/${id}`, payload);
    return response.recurring_component;
  },

  delete: async (id: number): Promise<string> => {
    const response = await api.delete(`${BASE_URL}/delete/${id}`);
    return response.message;
  },
};