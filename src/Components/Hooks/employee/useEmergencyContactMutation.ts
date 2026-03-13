import { 
    useMutation, 
    useQueryClient,
    useQuery, 
    UseQueryOptions
 } from "@tanstack/react-query";
import { EmergencyContactService } from "../../../services/employee/emergencyContactService";
import {
    EmergencyContact,
    CreateEmergencyContactPayload, 
    UpdateEmergencyContactPayload 
} from "../../../types/employee/emergencyContact";

export const emergencyContactKeys = {
  all: ["EmergencyContact"] as const,
  lists: () => [...emergencyContactKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...emergencyContactKeys.lists(), params] as const,
  details: () => [...emergencyContactKeys.all, "detail"] as const,
  detail: (id: number) => [...emergencyContactKeys.all, "detail", id] as const,
};


export const useEmployeesEmergencyContacts = (
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<EmergencyContact[]>, "queryKey" | "queryFn"> 
) => {
  return useQuery<EmergencyContact[]>({
    queryKey: emergencyContactKeys.list(params),
    queryFn: () => EmergencyContactService.getAllContacts(),
    ...options,
  });
};

export const useEmployeesEmergencyContact = (
    id: number,
    options?: Omit<
      UseQueryOptions<EmergencyContact>, 
      "queryKey" | "queryFn"
    >
) => {
    return useQuery<EmergencyContact>({
        queryKey: emergencyContactKeys.detail(id),
        queryFn: () => EmergencyContactService.getById(id),
        enabled: Boolean(id),
        ...options,
    });
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