import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BankDetailService } from "../../../services/employee/bankDetailService";
import { 
    CreateBankDetailPayload, 
    UpdateBankDetailPayload 
} from "../../../types/employee/bankDetail";

export const bankDetailKeys = {
    all: ["bankDetails"] as const,
    byEmployee: (empId: number) => [...bankDetailKeys.all, "employee", empId] as const,
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