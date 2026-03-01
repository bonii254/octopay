import { APIClient } from "helpers/api_helper";
import { Designation, DesignationPayload } from "types/designation";

const api = new APIClient();
const BASE_URL = "/designation";


export const designationService = {
    getAll: async (): Promise<Designation[]> => {
      const response = await api.get(`${BASE_URL}/all`);
      return response.designations;
    },

    getById: async (id: number): Promise<Designation> => {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.designation;
    },

    create: async (payload: DesignationPayload): Promise<Designation> => {
      const response = await api.create(`${BASE_URL}/register`, payload);
      return response.designation;
    },

    update: async (
      id: number, 
      payload: Partial<DesignationPayload>
    ): Promise<Designation> => {
      const response = await api.update(`${BASE_URL}/update/${id}`, payload);
      return response.designation;
    },

    remove: async (id: number): Promise<string> => {
        const response = await api.delete(`${BASE_URL}/delete/${id}`);
        return response.message;
    },
};