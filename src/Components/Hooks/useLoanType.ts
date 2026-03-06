import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryOptions 
} from "@tanstack/react-query";
import { LoanTypeService } from "../../services/loanTypeService";
import {
  LoanType,
  LoanTypePayload,
  UpdateLoanTypeRequest
} from "../../types/loanTypes"; 


export const loanTypeKeys = {
  all: ["loantypes"] as const,
  lists: () => [...loanTypeKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...loanTypeKeys.lists(), params] as const,
  details: () => [...loanTypeKeys.all, "detail"] as const,
  detail: (id: number) => [...loanTypeKeys.details(), id] as const,
};

export const useLoanTypes = (
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<LoanType[]>, "queryKey" | "queryFn"> 
) => {
  return useQuery<LoanType[]>({
    queryKey: loanTypeKeys.list(params),
    queryFn: () => LoanTypeService.getAllLoanTypes(),
    ...options,
  });
};

export const useLoanType = (
  id: number,
  options?: Omit<UseQueryOptions<LoanType>, "queryKey" | "queryFn"> 
) => {
  return useQuery<LoanType>({
    queryKey: loanTypeKeys.detail(id),
    queryFn: () => LoanTypeService.getLoanById(id),
    ...options,
  });
}

export const useLoanTypeMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: LoanTypePayload) => LoanTypeService.createLoanType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanTypeKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLoanTypeRequest }) => 
      LoanTypeService.updateLoanType(id, data),  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanTypeKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => LoanTypeService.deleteLoanType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanTypeKeys.all });
    },
  });

  return {
    createLoanType: createMutation.mutateAsync,
    updateLoanType: updateMutation.mutateAsync,
    deleteLoanType: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};