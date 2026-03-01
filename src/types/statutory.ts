export interface StatutoryConfiguration {
    id: number;
    effective_date: string;
    effective_to?: string | null;
    nssf_tier_1_limit: string | number;
    nssf_tier_2_limit: string | number;

    nssf_rate: string | number;
    housing_levy_rate: string | number;
    shif_rate: string | number;

    personal_relief: string | number;
    nita_levy?: string | number | null;

    is_active: boolean;

    created_at?: string;
    updated_at?: string;
}

export type CreateStatutoryConfigRequest = Omit<StatutoryConfiguration, "id" | "created_at" | "updated_at">;

export type UpdateStatutoryConfigRequest = Partial<CreateStatutoryConfigRequest>;