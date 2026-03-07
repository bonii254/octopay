import { APIClient } from "../helpers/api_helper";
import { Company, CompanyPayload } from "../types/company";

const api = new APIClient();

export const CompanyService = {
  getCompany: async (): Promise<Company> => {
    const response = await api.get("/company");
    return response.company;
  },

  prepareFormData: (data: Partial<CompanyPayload>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'logo' && value instanceof File) {
          formData.append('logo', value);
        } else {
          formData.append(key, value as string);
        }
      }
    });
    return formData;
  },

  updateCompany: async (data: Partial<CompanyPayload>): Promise<Company> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    const response = await api.put("/company/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.company;
  },

  registerCompany: async (data: CompanyPayload): Promise<Company> => {
    const formData = CompanyService.prepareFormData(data);
    const response = await api.create("/company/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.company;
  }
};