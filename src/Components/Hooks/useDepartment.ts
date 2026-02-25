import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { departmentService } from "../../services/departmentService";
import {
  Department,
  DepartmentPayload,
} from "../../types/department";

export const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...departmentKeys.lists(), params] as const,
  details: () => [...departmentKeys.all, "detail"] as const,
  detail: (id: number) => [...departmentKeys.details(), id] as const,
};

export const useDepartments = (
  params?: Record<string, unknown>,
  options?: Omit<
    UseQueryOptions<Department[]>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<Department[]>({
    queryKey: departmentKeys.list(params),
    queryFn: () => departmentService.getAll(),
    ...options,
  });
};

export const useDepartment = (
  id: number,
  options?: Omit<
    UseQueryOptions<Department>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<Department>({
    queryKey: departmentKeys.detail(id),
    queryFn: () => departmentService.getById(id),
    enabled: Boolean(id),
    ...options,
  });
};

export const useDepartmentMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: DepartmentPayload) =>
      departmentService.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: departmentKeys.all,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<DepartmentPayload>;
    }) => departmentService.update(id, data),

    onSuccess: (updatedDepartment) => {
      queryClient.invalidateQueries({
        queryKey: departmentKeys.all,
      });
      queryClient.setQueryData(
        departmentKeys.detail(updatedDepartment.id),
        updatedDepartment
      );
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      departmentService.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: departmentKeys.all,
      });
    },
  });

  return {
    createDepartment: createMutation.mutateAsync,
    updateDepartment: updateMutation.mutateAsync,
    deleteDepartment: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
