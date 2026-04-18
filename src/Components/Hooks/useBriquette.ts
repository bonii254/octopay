import { useState } from "react"; // Fixed import from gridjs to react
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BriquetteService } from "../../services/briquetteService";
import { handleBackendErrors } from "../../helpers/form_utils"; // Assuming path
import { 
  BriquetteLog,
  CreateBriquettePayload, 
  UpdateBriquettePayload 
} from "../../types/briquette";
import { toast } from "react-toastify";

export const useBriquetteAttendant = () => {
  const queryClient = useQueryClient();
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const todaysLog = useQuery({
    queryKey: ["briquettes", "today"],
    queryFn: () => BriquetteService.getTodaysLog(),
    retry: false,
    staleTime: 1000 * 60 * 5, 
  });

  const mutationOptions = {
    onMutate: () => {
      setFormErrors({});
      setGlobalError(null);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["briquettes", "today"] });
      return data;
    },
    onError: (error: any) => {
      handleBackendErrors(error, setFormErrors, setGlobalError);
      
      const errorMessage = error.response?.data?.message || error.message || "Action failed";
      toast.error(errorMessage);
    }
  };

  const initializeMorning = useMutation({
    mutationFn: (payload: CreateBriquettePayload) => 
      BriquetteService.createLog(payload),
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
      toast.success("Morning stock initialized successfully");
    }
  });

  const updateProgress = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBriquettePayload }) => 
      BriquetteService.updateLog(id, data),
    ...mutationOptions,
    onSuccess: (data: BriquetteLog) => {
      mutationOptions.onSuccess(data);
      
      if (data.status === "SUBMITTED") {
        toast.info("Log submitted for QAE review");
      } else {
        toast.success("Inventory progress saved");
      }
    }
  });

  return {
    log: todaysLog.data || null,
    isLoading: todaysLog.isLoading,
    isInitializing: initializeMorning.isPending,
    isUpdating: updateProgress.isPending,
    
    formErrors,
    globalError,
    setGlobalError,
    
    startDay: initializeMorning.mutateAsync,
    saveProgress: updateProgress.mutateAsync,
    saveProgressAsync: updateProgress.mutateAsync,
    
    queryError: todaysLog.error
  };
};