export interface Company {
  id: number;
  name: string;
  prefix: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  fiscal_year_start: string; // ISO Date string
  logo_url: string;
  has_logo: boolean;
  working_days?: number[];
}

export interface CompanyPayload {
  name: string;
  prefix: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  fiscal_year_start: string;
  logo?: File | null;
  working_days?: number[];
}