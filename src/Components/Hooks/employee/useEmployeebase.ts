import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryOptions 
} from "@tanstack/react-query";
import { EmployeeBaseService } from "../../../services/employee/employeeBaseService";
import {
  EmployeeBase,
  CreateEmployeePayload,
  UpdateEmployeePayload
} from "../../../types/employee/employeebase"; 


export const employeeBaseKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeBaseKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...employeeBaseKeys.lists(), params] as const,
  details: () => [...employeeBaseKeys.all, "detail"] as const,
  detail: (id: number) => [...employeeBaseKeys.details(), id] as const,
};

export const useEmployeesBase = (
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<EmployeeBase[]>, "queryKey" | "queryFn"> 
) => {
  return useQuery<EmployeeBase[]>({
    queryKey: employeeBaseKeys.list(params),
    queryFn: () => EmployeeBaseService.getAllEmployees(),
    ...options,
  });
};

export const useEmployeeBaseMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateEmployeePayload) => EmployeeBaseService.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeBaseKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmployeePayload }) => 
      EmployeeBaseService.updateEmployee(id, data),  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeBaseKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => EmployeeBaseService.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeBaseKeys.all });
    },
  });

  return {
    CreateEmployeeBase: createMutation.mutateAsync,
    UpdateEmployeeBase: updateMutation.mutateAsync,
    deleteSEmployeeBase: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};