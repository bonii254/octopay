import { useQuery } from "@tanstack/react-query";
import { LeavePreviewService } from "../../services/leavePreviewService";

export const useLeavePreview = (payload: any, enabled: boolean) => {
  return useQuery({
    queryKey: ["leavePreview", payload],
    queryFn: () => LeavePreviewService.preview(payload),
    enabled,
  });
};