import { APIClient } from "../helpers/api_helper";

const api = new APIClient();

export const LeavePreviewService = {
  preview: (payload: any) => api.create("/leave-preview", payload),
};