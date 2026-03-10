import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmergencyContactService } from "../../../services/employee/emergencyContactService";
import { 
    CreateEmergencyContactPayload, 
    UpdateEmergencyContactPayload 
} from "../../../types/employee/emergencyContact";

export const emergencyContactKeys = {
    all: ["emergencyContacts"] as const,
    detail: (id: number) => [...emergencyContactKeys.all, "detail", id] as const,
};

export const useEmergencyContactMutation = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CreateEmergencyContactPayload) => 
            EmergencyContactService.createEmergencyContact(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: emergencyContactKeys.all });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateEmergencyContactPayload }) => 
            EmergencyContactService.updateEmergencyContact(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: emergencyContactKeys.all });
        },
    });

    return {
        CreateEmergencyContact: createMutation.mutateAsync,
        UpdateEmergencyContact: updateMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
    };
};