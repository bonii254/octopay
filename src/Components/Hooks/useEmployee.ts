import { 
    useQuery,
    useMutation, 
    useQueryClient, 
    UseQueryOptions 
} from "@tanstack/react-query";
import { employeeService } from "../../services/employeeService";
import { 
    EmployeeBase,
    CreateEmployeePayload,
    UpdateEmployeePayload
 } from "../../types/employee/employeebase";   


export const employeeKeys = {
    all: ["employees"] as const,
    lists: () => [...employeeKeys.all, "list"] as const,
    list: (params?: Record<string, unknown>) => 
        [...employeeKeys.lists(), params] as const,
    details: () => [...employeeKeys.all, "detail"] as const,
    detail: (id: number) => [...employeeKeys.details(), id] as const,
};

export const useEmployees = (
    params?: Record<string, unknown>,
    options?: Omit<UseQueryOptions<EmployeeBase[]>, "queryKey" | "queryFn">
) => {
    return useQuery<EmployeeBase[]>({
        queryKey: employeeKeys.list(params),
        queryFn: () => employeeService.getAll(),
        ...options,
    });
};

export const useEmployee = (
    id: number,
    options?: Omit<
      UseQueryOptions<EmployeeBase>, 
      "queryKey" | "queryFn"
    >
) => {
    return useQuery<EmployeeBase>({
        queryKey: employeeKeys.detail(id),
        queryFn: () => employeeService.getById(id),
        enabled: Boolean(id),
        ...options,
    });
};

export const useEmployeeMutation = () => {
    const queryClient = useQueryClient(); 

    const createMutation = useMutation({
        mutationFn: (data: CreateEmployeePayload) => 
            employeeService.create(data),   

        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: employeeKeys.all });
        },
    });

const updateMutation = useMutation({
        mutationFn: ({ 
            id, 
            data 
        }: { id: number; 
            data: Partial<UpdateEmployeePayload> 
        }) => employeeService.update(id, data),

        onSuccess: (updatedEmployee) => {
            queryClient.invalidateQueries({ 
                queryKey: employeeKeys.all });
            queryClient.setQueryData(
                employeeKeys.detail(updatedEmployee.id),
                updatedEmployee
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => employeeService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: employeeKeys.all });
        },
    });

    return {
        createMutation: createMutation.mutateAsync,
        updateMutation: updateMutation.mutateAsync,
        deleteMutation: deleteMutation.mutateAsync,

        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}