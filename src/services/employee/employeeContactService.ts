import { APIClient } from "../../helpers/api_helper";
import {
    EmployeeContact,
    CreateEmployeeContactPayload,
    UpdateEmployeeContactPayload
} from "../../types/employee/employeeContact";

const api = new APIClient();
const BASE_URL = "/employeecontact";

export const EmployeeContactService = {
    getAllContacts: async (): Promise<EmployeeContact[]> => {
        const response = await api.get("/employeecontacts"); 
        return response.employee_contacts;
    },

    createContact: async (payload: CreateEmployeeContactPayload): Promise<EmployeeContact> => {
        const response = await api.create(`${BASE_URL}/register`, payload);
        return response.employeeContact;
    },

    updateContact: async (id: number, payload: UpdateEmployeeContactPayload): Promise<EmployeeContact> => {
        const response = await api.update(`${BASE_URL}/update/${id}`, payload);
        return response.employee_contact;
    },

    deleteContact: async (id: number): Promise<string> => {
        const response = await api.delete(`${BASE_URL}/delete/${id}`);
        return response.message;
    }
};