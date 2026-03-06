import { APIClient } from "../helpers/api_helper"
import {
    LeaveType,
    CreateLeaveTypeRequest,
    UpdateLeaveTypeRequest
} from "../types/leave"

const api = new APIClient();

const BASE_URL = "/leavetype"


export const LeaveTypeService = {
    getAllLeaveTypes: async (): Promise<LeaveType[]> => {
            const response = await api.get(`${BASE_URL}`);
            return response.leavetypes
    },

    getLeaveById: async (id: number): Promise<LeaveType> => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.leavetype;
    },

    createLeaveType: async (payload: CreateLeaveTypeRequest): Promise<LeaveType> => {
        const response = await api.create(`${BASE_URL}/register`, payload)
        return response.leavetype;
    },

    updateLeaveType: async (id: number, payload: UpdateLeaveTypeRequest): Promise<LeaveType> => {
        const response = await api.update(`${BASE_URL}/update/${id}`, payload);
        return response.leavetype;
    },
    
    deleteLeaveType: async (id: number): Promise<string> => {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.message;
    },
} 