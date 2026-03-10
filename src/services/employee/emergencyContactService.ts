import { APIClient } from "../../helpers/api_helper";
import {
    EmergencyContact,
    CreateEmergencyContactPayload,
    UpdateEmergencyContactPayload
} from "../../types/employee/emergencyContact";

const api = new APIClient();
const BASE_URL = "/emergency";

export const EmergencyContactService = {
    createEmergencyContact: async (payload: CreateEmergencyContactPayload): Promise<EmergencyContact> => {
        const response = await api.create(`${BASE_URL}/register`, payload);
        return response.emergency_contact;
    },

    updateEmergencyContact: async (id: number, payload: UpdateEmergencyContactPayload): Promise<EmergencyContact> => {
        const response = await api.update(`${BASE_URL}/update/${id}`, payload);
        return response.emergency_contact;
    },

    deleteEmergencyContact: async (id: number): Promise<string> => {
        const response = await api.delete(`${BASE_URL}/delete/${id}`);
        return response.message;
    }
};