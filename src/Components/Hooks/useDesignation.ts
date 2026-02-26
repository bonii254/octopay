import { 
    useQuery, 
    useMutation, 
    useQueryClient, 
    UseQueryOptions 
} from "@tanstack/react-query";
import { designationService } from "../../services/designationService";
import { Designation, DesignationPayload } from "../../types/designation";


export const designationKeys = {
    all: ["designations"] as const,
    lists: () => [...designationKeys.all, "list"] as const,
    list: (params?: Record<string, unknown>) => 
        [...designationKeys.lists(), params] as const,
    details: () => [...designationKeys.all, "detail"] as const,
    detail: (id: number) => [...designationKeys.details(), id] as const,
};

export const useDesignations = (
    params?: Record<string, unknown>,
    options?: Omit<UseQueryOptions<Designation[]>, "queryKey" | "queryFn">
) => {
    return useQuery<Designation[]>({
        queryKey: designationKeys.list(params),
        queryFn: () => designationService.getAll(),
        ...options,
    });
};

export const useDesignation = (
    id: number,
    options?: Omit<UseQueryOptions<Designation>, "queryKey" | "queryFn">
) => {
    return useQuery<Designation>({
        queryKey: designationKeys.detail(id),
        queryFn: () => designationService.getById(id),
        ...options,
    });
};

export const useDesignationMutation = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: DesignationPayload) => 
            designationService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: designationKeys.all });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<DesignationPayload> }) =>
            designationService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: designationKeys.all });
        },
    });
    
    const deleteMutation = useMutation({
        mutationFn: (id: number) => designationService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: designationKeys.all });
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
};