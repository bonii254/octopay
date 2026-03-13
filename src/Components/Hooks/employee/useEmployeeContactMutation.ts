import { 
    useMutation, 
    useQueryClient, 
    useQuery, 
    UseQueryOptions 
} from "@tanstack/react-query";
import { EmployeeContactService } from "../../../services/employee/employeeContactService";
import { 
    EmployeeContact,
    CreateEmployeeContactPayload, 
    UpdateEmployeeContactPayload 
} from "../../../types/employee/employeeContact";

export const employeeContactKeys = {
  all: ["employeeContacts"] as const,
  lists: () => [...employeeContactKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...employeeContactKeys.lists(), params] as const,
  details: () => [...employeeContactKeys.all, "detail"] as const,
  detail: (id: number) => [...employeeContactKeys.all, "detail", id] as const,
};

export const useEmployeesContacts = (
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<EmployeeContact[]>, "queryKey" | "queryFn"> 
) => {
  return useQuery<EmployeeContact[]>({
    queryKey: employeeContactKeys.list(params),
    queryFn: () => EmployeeContactService.getAllContacts(),
    ...options,
  });
};

export const useEmployeesContact = (
    id: number,
    options?: Omit<
      UseQueryOptions<EmployeeContact>, 
      "queryKey" | "queryFn"
    >
) => {
    return useQuery<EmployeeContact>({
        queryKey: employeeContactKeys.detail(id),
        queryFn: () => EmployeeContactService.getById(id),
        enabled: Boolean(id),
        ...options,
    });
};


export const useContactMutation = () => {
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