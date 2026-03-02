import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryOptions 
} from "@tanstack/react-query";
import { TaxBandService } from "../../services/taxBandService";
import {
  TaxBand,
  CreateTaxBandRequest,
  UpdateTaxBandRequest
} from "../../types/taxBand"; 

export const taxBandKeys = {
  all: ["taxBands"] as const,
  lists: () => [...taxBandKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...taxBandKeys.lists(), params] as const,
  details: () => [...taxBandKeys.all, "detail"] as const,
  detail: (id: number) => [...taxBandKeys.details(), id] as const,
  byDate: (date: string) => [...taxBandKeys.all, "byDate", date] as const,
};

export const useTaxBands = (
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<TaxBand[]>, "queryKey" | "queryFn"> 
) => {
  return useQuery<TaxBand[]>({
    queryKey: taxBandKeys.list(params),
    queryFn: () => TaxBandService.getAllTaxBands(),
    ...options,
  });
};

export const useTaxBand = (
  id: number,
  options?: Omit<UseQueryOptions<TaxBand>, "queryKey" | "queryFn"> 
) => {
  return useQuery<TaxBand>({
    queryKey: taxBandKeys.detail(id),
    queryFn: () => TaxBandService.getTaxBandById(id),
    enabled: !!id,
    ...options,
  });
};

export const useTaxBandMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateTaxBandRequest) => TaxBandService.createTaxBand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxBandKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaxBandRequest }) => 
      TaxBandService.updateTaxBand(id, data),  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxBandKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => TaxBandService.deleteTaxBand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxBandKeys.all });
    },
  });

  return {
    createTaxBand: createMutation.mutateAsync,
    updateTaxBand: updateMutation.mutateAsync,
    deleteTaxBand: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const formatAsPercentage = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) return "0.00%";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? "0.00%" : `${(num * 100).toFixed(2)}%`;
};

export const formatCurrency = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) return "0.00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? "0.00" : num.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};