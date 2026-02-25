import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

export const useGetCompany = () => {
  return useQuery({
    queryKey: ["company"],
    queryFn: async () => {
      try {
        const response = await api.get("/company");
        return response.company;
      } catch (error: any) {
        if (error.status === 404) return null;
        throw error;
      }
    },
    retry: false,
  });
};

export const useSaveCompany = (isUpdate: boolean) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = isUpdate 
        ? await api.put("/company/update", formData, { headers: { "Content-Type": "multipart/form-data" } })
        : await api.create("/company/register", formData, { headers: { "Content-Type": "multipart/form-data" } });
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
    onError: (error: any) => {
      console.error("Backend Error Detail:", error.response?.data || error);
    }
  });
};


export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete("/company");
      return response;
    },
    onSuccess: () => {
      queryClient.setQueryData(["company"], null);
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
  });
};