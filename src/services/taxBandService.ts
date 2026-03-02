import { APIClient } from "../helpers/api_helper";
import { 
    TaxBand, 
    CreateTaxBandRequest, 
    UpdateTaxBandRequest 
} from "../types/taxBand";

const api = new APIClient();

const BASE_URL = "/tax-bands";

export const TaxBandService = {
    getAllTaxBands: async (): Promise<TaxBand[]> => {
        const response = await api.get(`${BASE_URL}/all`);
        return response.tax_bands;
    },

    getTaxBandById: async (id: number): Promise<TaxBand> => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.tax_band;
    },

    createTaxBand: async (payload: CreateTaxBandRequest): Promise<TaxBand[]> => {
        const response = await api.create(`${BASE_URL}/register`, [payload]);
        return response.tax_bands;
    },  

    updateTaxBand: async (id: number, payload: UpdateTaxBandRequest): Promise<TaxBand> => {
        const response = await api.update(`${BASE_URL}/${id}`, payload);
        return response.tax_band;
    },

    deleteTaxBand: async (id: number): Promise<string> => {
        const response = await api.delete(`${BASE_URL}/delete/${id}`);
        return response.message;
    },

    getTaxBandsByDate: async (date: string): Promise<TaxBand[]> => {
        const response = await api.get(`${BASE_URL}/effective/${date}`);
        return response.tax_bands;
    }
};