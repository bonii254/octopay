import {
    useQuery, 
    useMutation, 
    useQueryClient,
    UseQueryOptions
} from "@tanstack/react-query"
import { SalaryComponentService } from "../../services/salaryComponent"
import {
    SalaryComponentBase,
    SalaryComponent,
    CreateSalaryComponentRequest,
    UpdateSalaryComponentRequest
} from "../../types/salaryComponent"


export const salaryComponentKeys = {
    all: ["salaryComponets"] as const,
    lists: () => [...salaryComponentKeys.all, "list"] as const,
    list: (params?: Record<string, unknown>) =>
        [...salaryComponentKeys.lists(), params] as const,
    details: () => [...salaryComponentKeys.all, "details"] as const,
    detail: (id: number) => [...salaryComponentKeys.details(), id] as const,
};


export const useSalaryComponents = (
    params?: Record<string, unknown>,
    options?: Omit<UseQueryOptions<SalaryComponent[]>,  "queryKey" | "queryFn">
) => {
    return useQuery<SalaryComponent[]>({
        queryKey: salaryComponentKeys.list(params),
        queryFn: () => SalaryComponentService.getAllComponents(),
        ...options,
    });
};

export const useSalaryComponent = (
    id: number,
    options?: Omit<UseQueryOptions<SalaryComponentBase>, "QueryKey" | "queryFn">
) => {
    return  useQuery<SalaryComponentBase>({
        queryKey: salaryComponentKeys.detail(id),
        queryFn: () => SalaryComponentService.getComponentById(id),
        ...options
    });
}

export const useSalaryComponentMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateSalaryComponentRequest) => SalaryComponentService.createComponent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salaryComponentKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSalaryComponentRequest }) => 
      SalaryComponentService.updateComponent(id, data),  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salaryComponentKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => SalaryComponentService.deleteComponent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salaryComponentKeys.all });
    },
  });

  return {
    createSalaryComponent: createMutation.mutateAsync,
    updateSalaryComponent: updateMutation.mutateAsync,
    deleteSalaryComponent: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};