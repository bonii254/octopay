import { APIClient } from "../helpers/api_helper";
import { 
  LeaveApplication, 
  LeaveStatus, 
  Notification, 
  ContextualIntelligence 
} from "../types/leaveApplication";

const api = new APIClient();
const BASE_URL = "/leave-application";

export const LeaveService = {
  getAll: async (): Promise<LeaveApplication[]> => api.get(`${BASE_URL}/`),

  getById: async (id: number): Promise<LeaveApplication> => 
    api.get(`${BASE_URL}/${id}`),

  apply: async (formData: FormData): Promise<{ message: string; leave: LeaveApplication }> => {
    return api.createWithFile(`${BASE_URL}/apply`, formData);
  },

  update: async (id: number, formData: FormData): Promise<{ message: string; leave: LeaveApplication }> => {
    return api.patchWithFile(`${BASE_URL}/apply/${id}`, formData);
  },

  delete: async (id: number): Promise<{ message: string }> => 
    api.delete(`${BASE_URL}/${id}`),

  approve: async (id: number): Promise<{ message: string }> => 
    api.create(`${BASE_URL}/${id}/approve`, {}),

  reject: async (id: number, reason: string): Promise<{ message: string }> => 
    api.create(`${BASE_URL}/${id}/reject`, { reason }),

  bulkAction: async (ids: number[], action: "APPROVE" | "REJECT", note?: string): Promise<{ message: string }> => {
    return api.create(`${BASE_URL}/bulk-action`, { ids, action, note });
  },

  getIntelligence: async (id: number): Promise<{ leave_id: number; intelligence: ContextualIntelligence }> => {
    return api.get(`${BASE_URL}/${id}/intelligence`);
  },

  getNotificationSummary: async (): Promise<{ unread_count: number; notifications: Notification[] }> => {
    return api.get(`${BASE_URL}/summary`);
  }
};