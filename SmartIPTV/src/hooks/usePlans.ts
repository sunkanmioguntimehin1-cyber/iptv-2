import { useQuery } from '@tanstack/react-query';
import { getPlans } from '../services/plansApi';

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });
}
