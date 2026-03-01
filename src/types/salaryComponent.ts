export enum PayrollComponentType {
    EARNING = "EARNING",
    DEDUCTION = "DEDUCTION",
}

export enum SalaryCalculationMethod {
    FIXED = "FIXED",
    PERCENTAGE_OF_BASIC = "PERCENTAGE_OF_BASIC",

    HOURLY_RATE = "HOURLY_RATE",
    DAILY_RATE = "DAILY_RATE",

    OVERTIME_1_5X = "OVERTIME_1_5X",
    OVERTIME_2X = "OVERTIME_2X",
    OVERTIME_CUSTOM_MULTIPLIER = "OVERTIME_CUSTOM_MULTIPLIER",

    PRORATED_BASIC = "PRORATED_BASIC",
    PRORATED_FIXED = "PRORATED_FIXED",

    PERCENTAGE_WITH_CAP = "PERCENTAGE_WITH_CAP",

    FORMULA = "FORMULA",
}


export interface SalaryComponentBase {
  name: string;
  code: string;
  is_taxable: boolean;
  is_statutory: boolean;
  is_pensionable: boolean;
  is_recurring: boolean;
  type: PayrollComponentType;
  affects_nssf: boolean;
  calculation_method: SalaryCalculationMethod;
}

export interface SalaryComponent extends SalaryComponentBase {
  id: number;
  created_at?: string;
  updated_at?: string;
}

export type CreateSalaryComponentRequest = SalaryComponentBase;

export type UpdateSalaryComponentRequest = Partial<CreateSalaryComponentRequest>;