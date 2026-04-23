import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FuelService } from "../../services/fuelService";
import { handleBackendErrors } from "../../helpers/form_utils";
import { 
  FuelDailyLog,
  CreateFuelLogPayload, 
  UpdateFuelLogPayload 
} from "../../types/fuel";
import { toast } from "react-toastify";

export const useFuelAttendant = (logId?: string) => {
  const queryClient = useQueryClient();
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  const currentLog = useQuery({
    queryKey: ["fuel", "today"],
    queryFn: () => FuelService.getTodaysLog(),
    retry: false,
    staleTime: 1000 * 60 * 5, 
  });

  const rejectedLogsQuery = useQuery({
    queryKey: ["fuel", "rejected"],
    queryFn: () => FuelService.getRejectedLogs(),
    retry: false,
  });

  const mutationOptions = {
    onMutate: () => {
      setFormErrors({});
      setGlobalError(null);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["fuel"] });
      return data;
    },
    onError: (error: any) => {
      handleBackendErrors(error, setFormErrors, setGlobalError);
      const errorMessage = error.response?.data?.message || error.message || "Action failed";
      toast.error(errorMessage);
    }
  };

  const initializeMorning = useMutation({
    mutationFn: (payload: CreateFuelLogPayload) => 
      FuelService.createLog(payload),
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
      toast.success("Morning fuel stock initialized successfully");
    }
  });

  const updateProgress = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFuelLogPayload }) => 
      FuelService.updateLog(id, data),
    ...mutationOptions,
    onSuccess: (data: FuelDailyLog) => {
      mutationOptions.onSuccess(data);
      
      if (data.status === "APPROVED") {
        toast.info("Fuel log submitted for QAE review");
      } else {
        toast.success("Fuel record updated successfully");
      }
    }
  });

  return {
    log: currentLog.data || null,
    isLoading: currentLog.isLoading,
    rejectedLogs: rejectedLogsQuery.data || [],
    isLoadingLogs: rejectedLogsQuery.isLoading,
    isInitializing: initializeMorning.isPending,
    isUpdating: updateProgress.isPending,
    
    formErrors,
    globalError,
    setGlobalError,
    
    startDay: initializeMorning.mutateAsync,
    saveProgress: updateProgress.mutateAsync,
    
    queryError: currentLog.error
  };
};