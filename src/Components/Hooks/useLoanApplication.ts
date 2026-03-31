import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryOptions 
} from "@tanstack/react-query";
import { LoanService } from "../../services/loanApplicationService";
import {
  Loan,
  CreateLoanRequest,
  UpdateLoanRequest,
  ManualRepaymentRequest,
  LoanTopUpRequest,
  LoanStatement,
  LoanScheduleResponse
} from "../../types/loanApplication";

export const loanKeys = {
  all: ["loans"] as const,
  lists: () => [...loanKeys.all, "list"] as const,
  list: (params?: { status?: string; employee_id?: number }) => 
  [...loanKeys.lists(), JSON.stringify(params || {})] as const,
  details: () => [...loanKeys.all, "detail"] as const,
  detail: (id: number) => [...loanKeys.details(), id] as const,
  schedules: (id: number) => [...loanKeys.detail(id), "schedule"] as const,
  statements: (id: number) => [...loanKeys.detail(id), "statement"] as const,
};

// --- Queries ---

export const useLoans = (
  params?: { status?: string; employee_id?: number },
  options?: Omit<UseQueryOptions<Loan[]>, "queryKey" | "queryFn"> 
) => {
  return useQuery<Loan[]>({
    queryKey: loanKeys.list(params),
    queryFn: () => LoanService.getAllLoans(params),
    ...options,
  });
};

export const useLoanDetails = (
  id: number,
  options?: Omit<UseQueryOptions<Loan>, "queryKey" | "queryFn"> 
) => {
  return useQuery<Loan>({
    queryKey: loanKeys.detail(id),
    queryFn: () => LoanService.getLoanDetails(id),
    enabled: !!id,
    ...options,
  });
};

export const useLoanStatement = (
  id: number,
  options?: Omit<UseQueryOptions<LoanStatement>, "queryKey" | "queryFn">
) => {
  return useQuery<LoanStatement>({
    queryKey: loanKeys.statements(id),
    queryFn: () => LoanService.getLoanStatement(id),
    enabled: !!id,
    ...options,
  });
};

// --- Mutations ---

export const useLoanMutation = () => {
  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: (data: CreateLoanRequest) => LoanService.applyForLoan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLoanRequest }) => 
      LoanService.updateLoanApplication(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
      queryClient.invalidateQueries({ queryKey: loanKeys.detail(variables.id) });
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => LoanService.approveLoan(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
      queryClient.invalidateQueries({ queryKey: loanKeys.detail(id) });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => LoanService.rejectLoan(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
      queryClient.invalidateQueries({ queryKey: loanKeys.detail(id) });
    },
  });

  return {
    applyForLoan: applyMutation.mutateAsync,
    updateLoan: updateMutation.mutateAsync,
    approveLoan: approveMutation.mutateAsync,
    rejectLoan: rejectMutation.mutateAsync,

    isApplying: applyMutation.isPending,
    isUpdating: updateMutation.isPending,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};

export const useLoanTransactionMutation = () => {
  const queryClient = useQueryClient();

  const repayMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ManualRepaymentRequest }) => 
      LoanService.recordRepayment(id, data),
    onSuccess: (_, variables) => {
      // Invalidate everything for this loan as balances and schedules change
      queryClient.invalidateQueries({ queryKey: loanKeys.detail(variables.id) });
    },
  });

  const topUpMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: LoanTopUpRequest }) => 
      LoanService.topUpLoan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
    },
  });

  return {
    recordRepayment: repayMutation.mutateAsync,
    topUpLoan: topUpMutation.mutateAsync,
    isRepaying: repayMutation.isPending,
    isToppingUp: topUpMutation.isPending,
  };
};