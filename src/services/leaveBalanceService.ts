import { APIClient } from "../helpers/api_helper";
import {
  LeaveBalance,
  CreateLeaveBalanceRequest,
  UpdateLeaveBalanceRequest,
  RolloverRequest,
} from "../types/leaveBalance";

const api = new APIClient();
const BASE_URL = "/leave-balance";

export const LeaveBalanceService = {
  getAll: async (): Promise<LeaveBalance[]> => api.get(`${BASE_URL}/all`),

  getByEmployee: async (employeeId: number): Promise<LeaveBalance[]> =>
    api.get(`${BASE_URL}/employee/${employeeId}`),

  getById: async (id: number): Promise<LeaveBalance> =>
    api.get(`${BASE_URL}/${id}`),

  create: async (payload: CreateLeaveBalanceRequest): Promise<LeaveBalance> => {
    const res = await api.create(`${BASE_URL}/create`, payload);
    return res.balance;
  },

  update: async (
    id: number,
    payload: UpdateLeaveBalanceRequest,
  ): Promise<LeaveBalance> => {
    const res = await api.update(`${BASE_URL}/${id}`, payload);
    return res.balance;
  },

  delete: async (id: number): Promise<string> => {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.message;
  },

  freeze: async (id: number) => api.update(`${BASE_URL}/${id}/freeze`, {}),

  unfreeze: async (id: number) => api.update(`${BASE_URL}/${id}/unfreeze`, {}),

  rollover: async (payload: RolloverRequest) =>
    api.create(`${BASE_URL}/rollover`, payload),
};
