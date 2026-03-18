import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { LeaveBalanceService } from "../../services/leaveBalanceService";
import {
  CreateLeaveBalanceRequest,
  UpdateLeaveBalanceRequest,
  RolloverRequest,
} from "../../types/leaveBalance";

export const leaveBalanceKeys = {
  all: ["leaveBalances"] as const,
  employee: (id: number) => ["leaveBalances", "employee", id] as const,
  detail: (id: number) => ["leaveBalances", id] as const,
};

export const useLeaveBalances = () =>
  useQuery({
    queryKey: leaveBalanceKeys.all,
    queryFn: LeaveBalanceService.getAll,
  });

export const useEmployeeLeaveBalances = (employeeId: number) =>
  useQuery({
    queryKey: leaveBalanceKeys.employee(employeeId),
    queryFn: () => LeaveBalanceService.getByEmployee(employeeId),
    enabled: !!employeeId,
  });

export const useLeaveBalanceActions = () => {
  const qc = useQueryClient();

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: leaveBalanceKeys.all });

  return {
    create: useMutation({
      mutationFn: (data: CreateLeaveBalanceRequest) =>
        LeaveBalanceService.create(data),
      onSuccess: invalidate,
    }),

    update: useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: number;
        data: UpdateLeaveBalanceRequest;
      }) => LeaveBalanceService.update(id, data),
      onSuccess: invalidate,
    }),

    delete: useMutation({
      mutationFn: (id: number) => LeaveBalanceService.delete(id),
      onSuccess: invalidate,
    }),

    freeze: useMutation({
      mutationFn: (id: number) => LeaveBalanceService.freeze(id),
      onSuccess: invalidate,
    }),

    unfreeze: useMutation({
      mutationFn: (id: number) => LeaveBalanceService.unfreeze(id),
      onSuccess: invalidate,
    }),

    rollover: useMutation({
      mutationFn: (data: RolloverRequest) => LeaveBalanceService.rollover(data),
      onSuccess: invalidate,
    }),
  };
};
