import { 
    useMutation, 
    useQueryClient, 
    useQuery, 
    UseQueryOptions 
} from "@tanstack/react-query";
import { SalaryDetailService } from "../../../services/employee/salaryDetailService";
import { 
    SalaryDetail,
    CreateSalaryDetailPayload, 
    UpdateSalaryDetailPayload 
} from "../../../types/employee/salaryDetail";

export const salaryDetailKeys = {
    all: ["salaryDetails"] as const,
    lists: () => [...salaryDetailKeys.all, "list"] as const,
    list: (params?: Record<string, unknown>) =>
      [...salaryDetailKeys.lists(), params] as const,
    details: () => [...salaryDetailKeys.all, "detail"] as const,
    detail: (id: number) => [...salaryDetailKeys.all, "detail", id] as const,
    byEmployee: (empId: number) => [...salaryDetailKeys.all, "employee", empId] as const,
};


export const usesalaryDetails = (
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<SalaryDetail[]>, "queryKey" | "queryFn"> 
) => {
  return useQuery<SalaryDetail[]>({
    queryKey: salaryDetailKeys.list(params),
    queryFn: () => SalaryDetailService.getAllSalaryDetails(),
    ...options,
  });
};

export const usesalaryDetail = (
    id: number,
    options?: Omit<
      UseQueryOptions<SalaryDetail>, 
      "queryKey" | "queryFn"
    >
) => {
    return useQuery<SalaryDetail>({
        queryKey: salaryDetailKeys.detail(id),
        queryFn: () => SalaryDetailService.getSalaryByEmployee(id),
        enabled: Boolean(id),
        ...options,
    });
};


export const useSalaryDetailMutation = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CreateSalaryDetailPayload) => 
            SalaryDetailService.createSalaryDetail(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: salaryDetailKeys.all });
            queryClient.invalidateQueries({ queryKey: salaryDetailKeys.byEmployee(data.employee_id) });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateSalaryDetailPayload }) => 
            SalaryDetailService.updateSalaryDetail(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: salaryDetailKeys.all });
            queryClient.invalidateQueries({ queryKey: salaryDetailKeys.byEmployee(data.employee_id) });
        },
    });

    return {
        CreateSalaryDetail: createMutation.mutateAsync,
        UpdateSalaryDetail: updateMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
    };
};