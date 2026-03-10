import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmployeeContactService } from "../../../services/employee/employeeContactService";
import { 
    CreateEmployeeContactPayload, 
    UpdateEmployeeContactPayload 
} from "../../../types/employee/employeeContact";

export const employeeContactKeys = {
    all: ["employeeContacts"] as const,
    list: () => [...employeeContactKeys.all, "list"] as const,
    detail: (id: number) => [...employeeContactKeys.all, "detail", id] as const,
};

export const useEmployeeContactMutation = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CreateEmployeeContactPayload) => EmployeeContactService.createContact(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: employeeContactKeys.all });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateEmployeeContactPayload }) => 
            EmployeeContactService.updateContact(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: employeeContactKeys.all });
        },
    });

    return {
        CreateEmployeeContact: createMutation.mutateAsync,
        UpdateEmployeeContact: updateMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
    };
};