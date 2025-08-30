
// stores/useStoreInitializer.ts - Hook to initialize all stores
import { useEffect } from 'react';
import { 
  useDepartmentStore, 
  useUnitStore, 
  useCurrencyStore, 
  useVendorStore, 
  useLocationStore 
} from './index';

export const useStoreInitializer = () => {
  const fetchDepartments = useDepartmentStore(state => state.fetchDepartments);
  const fetchUnits = useUnitStore(state => state.fetchUnits);
  const fetchCurrencies = useCurrencyStore(state => state.fetchCurrencies);
  const fetchVendors = useVendorStore(state => state.fetchVendors);
  const fetchLocations = useLocationStore(state => state.fetchLocations);

  useEffect(() => {
    // Initialize all stores on app startup
    const initializeStores = async () => {
      await Promise.all([
        fetchDepartments(),
        fetchUnits(),
        fetchCurrencies(),
        fetchVendors(),
        fetchLocations()
      ]);
    };

    initializeStores();
  }, [fetchDepartments, fetchUnits, fetchCurrencies, fetchVendors, fetchLocations]);

  // Refetch on window focus for data freshness
  useEffect(() => {
    const handleFocus = () => {
      fetchDepartments();
      fetchUnits();
      fetchCurrencies();
      fetchVendors();
      fetchLocations();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchDepartments, fetchUnits, fetchCurrencies, fetchVendors, fetchLocations]);
};