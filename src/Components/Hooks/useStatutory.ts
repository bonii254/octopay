import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryOptions 
} from "@tanstack/react-query";
import { StatutoryService } from "../../services/statutoryService";
import {
  StatutoryConfiguration,
  CreateStatutoryConfigRequest,
  UpdateStatutoryConfigRequest
} from "../../types/statutory"; 


export const statutoryKeys = {
  all: ["statutoryConfigs"] as const,
  lists: () => [...statutoryKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...statutoryKeys.lists(), params] as const,
  details: () => [...statutoryKeys.all, "detail"] as const,
  detail: (id: number) => [...statutoryKeys.details(), id] as const,
};

export const useStatutoryConfigs = (
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<StatutoryConfiguration[]>, "queryKey" | "queryFn"> 
) => {
  return useQuery<StatutoryConfiguration[]>({
    queryKey: statutoryKeys.list(params),
    queryFn: () => StatutoryService.getAllConfigs(),
    ...options,
  });
};

export const useStatutoryConfig = (
  id: number,
  options?: Omit<UseQueryOptions<StatutoryConfiguration>, "queryKey" | "queryFn"> 
) => {
  return useQuery<StatutoryConfiguration>({
    queryKey: statutoryKeys.detail(id),
    queryFn: () => StatutoryService.getConfigById(id),
    ...options,
  });
}

export const useStatutoryMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateStatutoryConfigRequest) => StatutoryService.createConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statutoryKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStatutoryConfigRequest }) => 
      StatutoryService.updateConfig(id, data),  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statutoryKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => StatutoryService.deleteConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statutoryKeys.all });
    },
  });

  return {
    createStatutoryConfig: createMutation.mutateAsync,
    updateStatutoryConfig: updateMutation.mutateAsync,
    deleteStatutoryConfig: deleteMutation.mutateAsync,

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