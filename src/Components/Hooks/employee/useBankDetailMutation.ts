import { 
    useMutation, 
    useQueryClient, 
    useQuery, 
    UseQueryOptions 
} from "@tanstack/react-query";
import { BankDetailService } from "../../../services/employee/bankDetailService";
import {
    BankDetail,
    CreateBankDetailPayload, 
    UpdateBankDetailPayload 
} from "../../../types/employee/bankDetail";

export const bankDetailKeys = {
    all: ["bankDetails"] as const,
    lists: () => [...bankDetailKeys.all, "list"] as const,
    list: (params?: Record<string, unknown>) =>
      [...bankDetailKeys.lists(), params] as const,
    details: () => [...bankDetailKeys.all, "detail"] as const,
    detail: (id: number) => [...bankDetailKeys.all, "detail", id] as const,
    byEmployee: (empId: number) => [...bankDetailKeys.all, "employee", empId] as const,
};


export const useBankDetails = (
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<BankDetail[]>, "queryKey" | "queryFn"> 
) => {
  return useQuery<BankDetail[]>({
    queryKey: bankDetailKeys.list(params),
    queryFn: () => BankDetailService.getAllBankDetails(),
    ...options,
  });
};

export const useBankDetail = (
    id: number,
    options?: Omit<
      UseQueryOptions<BankDetail>, 
      "queryKey" | "queryFn"
    >
) => {
    return useQuery<BankDetail>({
        queryKey: bankDetailKeys.detail(id),
        queryFn: () => BankDetailService.getBankDetailsById(id),
        enabled: Boolean(id),
        ...options,
    });
};

export const useBankDetailMutation = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CreateBankDetailPayload) => 
            BankDetailService.createBankDetail(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: bankDetailKeys.all });
            queryClient.invalidateQueries({ queryKey: bankDetailKeys.byEmployee(data.employee_id) });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateBankDetailPayload }) => 
            BankDetailService.updateBankDetail(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: bankDetailKeys.all });
            queryClient.invalidateQueries({ queryKey: bankDetailKeys.byEmployee(data.employee_id) });
        },
    });

    return {
        CreateBankDetail: createMutation.mutateAsync,
        UpdateBankDetail: updateMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
    };
};