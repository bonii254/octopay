import { APIClient } from "../helpers/api_helper";
import { PublicHoliday } from "../types/leaveApplication";

const api = new APIClient();
const HOLIDAY_URL = "/public-holidays";

export const PublicHolidayService = {
  getAll: async (): Promise<PublicHoliday[]> => {
    const response = await api.get(`${HOLIDAY_URL}/`);
    return response.holidays;
  },

  getById: async (id: number): Promise<PublicHoliday> => 
    api.get(`${HOLIDAY_URL}/${id}`),

  create: async (payload: Partial<PublicHoliday>): Promise<{ message: string; holiday: PublicHoliday }> => {
    return api.create(`${HOLIDAY_URL}/`, payload);
  },

  update: async (id: number, payload: Partial<PublicHoliday>): Promise<{ message: string; holiday: PublicHoliday }> => {
    return api.update(`${HOLIDAY_URL}/${id}`, payload);
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return api.delete(`${HOLIDAY_URL}/${id}`);
  }
};