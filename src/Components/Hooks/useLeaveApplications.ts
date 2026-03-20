import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LeaveService } from "../../services/leaveApplication";

export const leaveKeys = {
  all: ["leaves"] as const,
  detail: (id: number) => ["leaves", "detail", id] as const,
  intelligence: (id: number) => ["leaves", "intelligence", id] as const,
  notifications: ["leaves", "notifications", "summary"] as const,
};

export const useLeaves = () =>
  useQuery({
    queryKey: leaveKeys.all,
    queryFn: LeaveService.getAll,
  });

export const useLeaveDetail = (id: number) =>
  useQuery({
    queryKey: leaveKeys.detail(id),
    queryFn: () => LeaveService.getById(id),
    enabled: !!id,
  });

export const useLeaveIntelligence = (id: number) =>
  useQuery({
    queryKey: leaveKeys.intelligence(id),
    queryFn: () => LeaveService.getIntelligence(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

export const useNotificationSummary = () =>
  useQuery({
    queryKey: leaveKeys.notifications,
    queryFn: LeaveService.getNotificationSummary,
    refetchInterval: 30000,
  });

export const useLeaveActions = () => {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: leaveKeys.all });
    queryClient.invalidateQueries({ queryKey: leaveKeys.notifications });
  };

  return {
    apply: useMutation({
      mutationFn: (formData: FormData) => LeaveService.apply(formData),
      onSuccess: invalidateAll,
    }),

    update: useMutation({
      mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
        LeaveService.update(id, formData),
      onSuccess: (data, variables) => {
        invalidateAll();
        queryClient.invalidateQueries({ queryKey: leaveKeys.detail(variables.id) });
      },
    }),

    delete: useMutation({
      mutationFn: (id: number) => LeaveService.delete(id),
      onSuccess: invalidateAll,
    }),

    approve: useMutation({
      mutationFn: (id: number) => LeaveService.approve(id),
      onSuccess: (data, id) => {
        invalidateAll();
        queryClient.invalidateQueries({ queryKey: leaveKeys.detail(id) });
      },
    }),

    reject: useMutation({
      mutationFn: ({ id, reason }: { id: number; reason: string }) =>
        LeaveService.reject(id, reason),
      onSuccess: (data, variables) => {
        invalidateAll();
        queryClient.invalidateQueries({ queryKey: leaveKeys.detail(variables.id) });
      },
    }),

    bulkAction: useMutation({
      mutationFn: (params: { ids: number[]; action: "APPROVE" | "REJECT"; note?: string }) =>
        LeaveService.bulkAction(params.ids, params.action, params.note),
      onSuccess: invalidateAll,
    }),
  };
};