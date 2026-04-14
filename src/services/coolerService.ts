import { APIClient } from "../helpers/api_helper";
import { 
    Cooler, 
    CoolerPayload, 
    UpdateCoolerRequest, 
    CoolerListResponse 
} from "../types/cooler";

const api = new APIClient();
const BASE_URL = "/v1/coolers";


export const CoolerService = {
  getAllCoolers: async (active?: boolean): Promise<CoolerListResponse> => {
    const params = active !== undefined ? { active: String(active) } : {};
    return await api.get(`${BASE_URL}`, { params });
  },

  createCooler: async (payload: CoolerPayload): Promise<Cooler> => {
    const response = await api.create(`${BASE_URL}`, payload);
    return response.cooler;
  },
  updateCooler: async (id: string, payload: UpdateCoolerRequest): Promise<Cooler> => {
    const response = await api.update(`${BASE_URL}/${id}`, payload);
    return response.cooler;
  },
  deleteCooler: async (id: string): Promise<{ message: string }> => {
    return await api.delete(`${BASE_URL}/${id}`);
  }
};