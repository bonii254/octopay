import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryOptions 
} from "@tanstack/react-query";
import { LeaveTypeService } from "../../services/leaveTypeService";
import {
  LeaveType,
  CreateLeaveTypeRequest,
  UpdateLeaveTypeRequest
} from "../../types/leave"; 


export const leaveTypeKeys = {
  all: ["leavetypes"] as const,
  lists: () => [...leaveTypeKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...leaveTypeKeys.lists(), params] as const,
  details: () => [...leaveTypeKeys.all, "detail"] as const,
  detail: (id: number) => [...leaveTypeKeys.details(), id] as const,
};

export const useLeaveTypes = (
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<LeaveType[]>, "queryKey" | "queryFn"> 
) => {
  return useQuery<LeaveType[]>({
    queryKey: leaveTypeKeys.list(params),
    queryFn: () => LeaveTypeService.getAllLeaveTypes(),
    ...options,
  });
};

export const useLeaveType = (
  id: number,
  options?: Omit<UseQueryOptions<LeaveType>, "queryKey" | "queryFn"> 
) => {
  return useQuery<LeaveType>({
    queryKey: leaveTypeKeys.detail(id),
    queryFn: () => LeaveTypeService.getLeaveById(id),
    ...options,
  });
}

export const useLeaveTypeMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateLeaveTypeRequest) => LeaveTypeService.createLeaveType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveTypeKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLeaveTypeRequest }) => 
      LeaveTypeService.updateLeaveType(id, data),  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveTypeKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => LeaveTypeService.deleteLeaveType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveTypeKeys.all });
    },
  });

  return {
    createLeaveType: createMutation.mutateAsync,
    updateLeaveType: updateMutation.mutateAsync,
    deleteLeaveType: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};