import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FuelService } from "../../services/fuelService";
import { QAEFuelApprovalPayload } from "../../types/fuel";
import { toast } from "react-toastify";

export const useFuelAdmin = (filters: Record<string, any> = { page: 1, per_page: 10 }) => {
  const queryClient = useQueryClient();

  const fuelLogs = useQuery({
    queryKey: ["fuel", "review", filters],
    queryFn: () => FuelService.reviewLogs(filters),
    placeholderData: (previousData) => previousData,
  });

  const processApproval = useMutation({
    mutationFn: ({ id, data }: { id: string; data: QAEFuelApprovalPayload }) => 
      FuelService.approveLog(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["fuel"] });
      if (res.log.status === "APPROVED") {
        toast.success("Fuel log approved");
      } else {
        toast.warn("Fuel log rejected and returned to Draft");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to process fuel approval");
    }
  });

  const removeLog = useMutation({
    mutationFn: (id: string) => FuelService.deleteLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel"] });
      toast.info("Fuel record deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Could not delete record");
    }
  });

  return {
    logs: fuelLogs.data?.logs || [],
    pagination: fuelLogs.data?.pagination || {
      total: 0,
      pages: 0,
      current_page: filters.page || 1,
      has_next: false,
      has_prev: false
    },
    isLoading: fuelLogs.isLoading,
    isProcessing: processApproval.isPending,
    isDeleting: removeLog.isPending,

    approveOrReject: processApproval.mutateAsync,
    deleteRecord: removeLog.mutateAsync,
    refetch: fuelLogs.refetch
  };
};