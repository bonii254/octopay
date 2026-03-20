import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicHolidayService } from "../../services/publicHoliday";
import { PublicHoliday } from "../../types/leaveApplication";

export const holidayKeys = {
  all: ["publicHolidays"] as const,
  detail: (id: number) => ["publicHolidays", id] as const,
};

export const usePublicHolidays = () =>
  useQuery({
    queryKey: holidayKeys.all,
    queryFn: PublicHolidayService.getAll,
  });

export const usePublicHoliday = (id: number) =>
  useQuery({
    queryKey: holidayKeys.detail(id),
    queryFn: () => PublicHolidayService.getById(id),
    enabled: !!id,
  });

export const usePublicHolidayActions = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: holidayKeys.all });

  return {
    create: useMutation({
      mutationFn: (data: Partial<PublicHoliday>) => PublicHolidayService.create(data),
      onSuccess: invalidate,
    }),

    update: useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<PublicHoliday> }) =>
        PublicHolidayService.update(id, data),
      onSuccess: (data, variables) => {
        invalidate();
        queryClient.invalidateQueries({ queryKey: holidayKeys.detail(variables.id) });
      },
    }),

    delete: useMutation({
      mutationFn: (id: number) => PublicHolidayService.delete(id),
      onSuccess: invalidate,
    }),
  };
};