export interface TaxBand {
  id: number;
  effective_from: string;
  lower_bound: number;
  upper_bound: number | null;
  rate: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaxBandRequest {
  effective_from: string;
  lower_bound: number;
  upper_bound: number | null;
  rate: number;
  is_active: boolean;
}

export interface UpdateTaxBandRequest extends Partial<CreateTaxBandRequest> {}

export interface TaxBandResponse {
  tax_bands: TaxBand[];
  message?: string;
}