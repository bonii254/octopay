import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BriquetteService } from "../../services/briquetteService";
import { QAEApprovalPayload } from "../../types/briquette";
import { toast } from "react-toastify";

export const useBriquetteAdmin = (filters: Record<string, any> = {}) => {
  const queryClient = useQueryClient();

  const auditLogs = useQuery({
    queryKey: ["briquettes", "review", filters],
    queryFn: () => BriquetteService.reviewLogs(filters),
  });

  const processApproval = useMutation({
    mutationFn: ({ id, data }: { id: string; data: QAEApprovalPayload }) => 
      BriquetteService.approveLog(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["briquettes"] });
      if (res.log.status === "APPROVED") {
        toast.success("Inventory record approved");
      } else {
        toast.warn("Log rejected and returned to attendant");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to process approval");
    }
  });

  const removeLog = useMutation({
    mutationFn: (id: string) => BriquetteService.deleteLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["briquettes"] });
      toast.error("Inventory record deleted");
    }
  });

  return {
    logs: auditLogs.data?.logs || [],
    totalCount: auditLogs.data?.count || 0,
    isLoading: auditLogs.isLoading,
    isProcessing: processApproval.isPending,
    isDeleting: removeLog.isPending,

    approveOrReject: processApproval.mutateAsync,
    deleteRecord: removeLog.mutateAsync,
    refetch: auditLogs.refetch
  };
};