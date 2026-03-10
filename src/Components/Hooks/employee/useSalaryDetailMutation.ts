import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SalaryDetailService } from "../../../services/employee/salaryDetailService";
import { 
    CreateSalaryDetailPayload, 
    UpdateSalaryDetailPayload 
} from "../../../types/employee/salaryDetail";

export const salaryDetailKeys = {
    all: ["salaryDetails"] as const,
    byEmployee: (empId: number) => [...salaryDetailKeys.all, "employee", empId] as const,
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