import { APIClient } from "../helpers/api_helper";
import { 
    StatutoryConfiguration, 
    CreateStatutoryConfigRequest,
    UpdateStatutoryConfigRequest
 } from "../types/statutory";


const api = new APIClient();

const BASE_URL = "/statutory";

export const StatutoryService = {
    getAllConfigs: async (): Promise<StatutoryConfiguration[]> => {
        const response = await api.get(`${BASE_URL}`);
        return response.statutory;
    },

    getConfigById: async (id: number): Promise<StatutoryConfiguration> => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.statutory;
    },

    createConfig: async (payload: CreateStatutoryConfigRequest): Promise<StatutoryConfiguration> => {
        const response = await api.create(`${BASE_URL}/register`, payload);
        return response.statutory;
    },  

    updateConfig: async (id: number, payload: UpdateStatutoryConfigRequest): Promise<StatutoryConfiguration> => {
        const response = await api.update(`${BASE_URL}/${id}`, payload);
        return response.statutory;
    },

    deleteConfig: async (id: number): Promise<string> => {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.message;
    },
};  