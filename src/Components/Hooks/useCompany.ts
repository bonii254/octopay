import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanyService } from "../../services/companyService";
import { CompanyPayload } from "../../types/company";

export const useCompany = () => {
  return useQuery({
    queryKey: ["company"],
    queryFn: CompanyService.getCompany,
    retry: false, 
  });
};

export const useCompanyMutation = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CompanyPayload>) => CompanyService.updateCompany(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["company"] }),
  });

  const registerMutation = useMutation({
    mutationFn: (data: CompanyPayload) => CompanyService.registerCompany(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["company"] }),
  });

  return {
    updateCompany: updateMutation.mutateAsync,
    registerCompany: registerMutation.mutateAsync,
    isUpdating: updateMutation.isPending || registerMutation.isPending,
  };
};