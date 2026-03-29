import { APIClient } from "../helpers/api_helper";
import {
  ILeaveApplication,
  ICreateLeavePayload,
  IUpdateLeavePayload,
  IPreviewLeavePayload,
  ILeavePreviewResponse,
  ILeaveIntelligenceFullResponse,
} from "../types/leaveApplication";

const api = new APIClient();
const BASE_URL = "/leave-application";

export const LeaveApplicationService = {
  getAll: async (): Promise<ILeaveApplication[]> => {
    const res = await api.get(`${BASE_URL}/`);
    return res.data;
  },

  getById: async (id: number): Promise<ILeaveApplication> => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
  },

  create: async (payload: ICreateLeavePayload | FormData): Promise<ILeaveApplication> => {
    const res = payload instanceof FormData
      ? await api.createWithFile(`${BASE_URL}/apply`, payload)
      : await api.create(`${BASE_URL}/apply`, payload);
    return res.data;
  },

  update: async (id: number, payload: IUpdateLeavePayload | FormData): Promise<ILeaveApplication> => {
    const res = payload instanceof FormData
      ? await api.patchWithFile(`${BASE_URL}/${id}`, payload)
      : await api.update(`${BASE_URL}/${id}`, payload);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  approve: async (id: number): Promise<ILeaveApplication> => {
    const res = await api.create(`${BASE_URL}/${id}/approve`, {});
    return res.data;
  },

  reject: async (id: number, reason: string): Promise<ILeaveApplication> => {
    const res = await api.create(`${BASE_URL}/${id}/reject`, { reason });
    return res.data;
  },
  getPreview: async (payload: IPreviewLeavePayload): Promise<ILeavePreviewResponse> => {
    const res = await api.create(`${BASE_URL}/preview`, payload);
    return res;
  },

  getIntelligence: async (id: number): Promise<ILeaveIntelligenceFullResponse> => {
    const res = await api.get(`${BASE_URL}/${id}/intelligence`);
    return res;
  },
};