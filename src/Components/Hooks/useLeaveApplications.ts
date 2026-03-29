import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LeaveApplicationService } from "../../services/leaveApplication";
import {
  ICreateLeavePayload,
  IUpdateLeavePayload,
  IPreviewLeavePayload,
} from "../../types/leaveApplication";
import { toast } from "react-toastify";

export const leaveKeys = {
  all: ["leaveApplications"] as const,
  detail: (id: number) => ["leaveApplications", "detail", id] as const,
  intelligence: (id: number) => ["leaveApplications", "intelligence", id] as const,
  preview: (payload: IPreviewLeavePayload) => ["leaveApplications", "preview", payload] as const,
};

export const useLeaveApplications = () =>
  useQuery({
    queryKey: leaveKeys.all,
    queryFn: LeaveApplicationService.getAll,
  });

export const useLeaveDetail = (id: number) =>
  useQuery({
    queryKey: leaveKeys.detail(id),
    queryFn: () => LeaveApplicationService.getById(id),
    enabled: !!id,
  });

export const useLeaveIntelligence = (id: number) =>
  useQuery({
    queryKey: leaveKeys.intelligence(id),
    queryFn: () => LeaveApplicationService.getIntelligence(id),
    enabled: !!id,
  });

export const useLeavePreview = (payload: IPreviewLeavePayload, enabled: boolean) =>
  useQuery({
    queryKey: leaveKeys.preview(payload),
    queryFn: () => LeaveApplicationService.getPreview(payload),
    enabled: enabled && !!payload.start_date && !!payload.end_date,
    staleTime: 1000 * 60, 
  });

export const useLeaveActions = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: leaveKeys.all });
  };

  return {
    create: useMutation({
      mutationFn: (data: ICreateLeavePayload | FormData) => 
        LeaveApplicationService.create(data),
      onSuccess: () => {
        invalidate();
        toast.success("Leave application submitted successfully");
      },
    }),

    update: useMutation({
      mutationFn: ({ id, data }: { id: number; data: IUpdateLeavePayload | FormData }) =>
        LeaveApplicationService.update(id, data),
      onSuccess: (data) => {
        invalidate();
        queryClient.invalidateQueries({ queryKey: leaveKeys.detail(data.id) });
        toast.success("Leave application updated");
      },
    }),

    delete: useMutation({
      mutationFn: (id: number) => LeaveApplicationService.delete(id),
      onSuccess: () => {
        invalidate();
        toast.success("Leave application deleted");
      },
    }),

    approve: useMutation({
      mutationFn: (id: number) => LeaveApplicationService.approve(id),
      onSuccess: (data) => {
        invalidate();
        queryClient.invalidateQueries({ queryKey: leaveKeys.detail(data.id) });
        toast.success("Leave application approved");
      },
    }),

    reject: useMutation({
      mutationFn: ({ id, reason }: { id: number; reason: string }) =>
        LeaveApplicationService.reject(id, reason),
      onSuccess: (data) => {
        invalidate();
        queryClient.invalidateQueries({ queryKey: leaveKeys.detail(data.id) });
        toast.warn("Leave application rejected");
      },
    }),
  };
};