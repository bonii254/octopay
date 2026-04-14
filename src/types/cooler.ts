export interface Cooler {
  id: string;
  name: string;
  is_active: boolean;
  fuel_capacity_liters: number;
  route: string;
  expected_consumption_rate: number;
  created_at: string;
  updated_at: string;
  
  fuel_logs_count?: number;
  briquette_logs_count?: number;
}

export interface CoolerPayload {
  name: string;
  route: string;
  fuel_capacity_liters: number;
  expected_consumption_rate: number;
  is_active?: boolean;
}


export interface UpdateCoolerRequest extends Partial<CoolerPayload> {}

export interface CoolerListResponse {
  coolers: Cooler[];
  total_count: number;
  total_pages: number;
  current_page: number;
  per_page: number;
}