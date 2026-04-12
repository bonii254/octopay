import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { EmployeeRecurringComponentService } from "../../services/recurringComponentService";
import {
  EmployeeRecurringComponent,
  CreateRecurringComponentPayload,
  UpdateRecurringComponentPayload,
} from "../../types/recurringComponents";

export const employeeRecurringComponentKeys = {
  all: ["employeeRecurringComponents"] as const,
  lists: () => [...employeeRecurringComponentKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...employeeRecurringComponentKeys.lists(), params] as const,
  matrix: (params?: Record<string, unknown>) => 
    [...employeeRecurringComponentKeys.all, "matrix", params] as const,
  details: () => [...employeeRecurringComponentKeys.all, "detail"] as const,
  detail: (id: number) => [...employeeRecurringComponentKeys.details(), id] as const,
};

export const useEmployeeRecurringComponentsPivot = (
  employeeId?: number,
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">
) => {
  return useQuery<any[]>({
    queryKey: employeeRecurringComponentKeys.matrix({ employeeId }),
    queryFn: () => EmployeeRecurringComponentService.getMatrix(employeeId),
    ...options,
  });
};

export const useEmployeeRecurringComponents = (
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<EmployeeRecurringComponent[]>, "queryKey" | "queryFn">
) => {
  return useQuery<EmployeeRecurringComponent[]>({
    queryKey: employeeRecurringComponentKeys.list(params),
    queryFn: () => EmployeeRecurringComponentService.getAll(),
    ...options,
  });
};

export const useEmployeeRecurringComponentsByEmployee = (
  employeeId: number | null | undefined,
  options?: Omit<UseQueryOptions<EmployeeRecurringComponent[], Error, EmployeeRecurringComponent[]>, "queryKey" | "queryFn" | "select">
) => {
  return useQuery<EmployeeRecurringComponent[], Error, EmployeeRecurringComponent[]>({
    queryKey: employeeRecurringComponentKeys.list(),
    queryFn: () => EmployeeRecurringComponentService.getAll(),
    // This perfectly handles your sidebar logic: it filters the cached list
    select: (data) => data.filter((comp) => comp.employee_id === employeeId),
    enabled: !!employeeId, 
    ...options,
  });
};

export const useEmployeeRecurringComponent = (
  id: number,
  options?: Omit<UseQueryOptions<EmployeeRecurringComponent>, "queryKey" | "queryFn">
) => {
  return useQuery<EmployeeRecurringComponent>({
    queryKey: employeeRecurringComponentKeys.detail(id),
    queryFn: () => EmployeeRecurringComponentService.getById(id),
    ...options,
  });
};

export const useEmployeeRecurringComponentMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateRecurringComponentPayload) =>
      EmployeeRecurringComponentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeRecurringComponentKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRecurringComponentPayload }) =>
      EmployeeRecurringComponentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeRecurringComponentKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => EmployeeRecurringComponentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeRecurringComponentKeys.all });
    },
  });

  return {
    createRecurringComponent: createMutation.mutateAsync,
    updateRecurringComponent: updateMutation.mutateAsync,
    deleteRecurringComponent: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};