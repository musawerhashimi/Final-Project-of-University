
// hooks/useCustomers.ts
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../lib/customerApi';
import { type CustomerFormData } from '../entities/Customer';

export const useCustomers = (search: string = '') => {
  return useInfiniteQuery({
    queryKey: ['customers', search],
    queryFn: ({ pageParam = 1 }) => customerApi.getCustomers(pageParam, search),
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        return parseInt(url.searchParams.get('page') || '1');
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (customerData: CustomerFormData) => customerApi.createCustomer(customerData),
    onSuccess: () => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};