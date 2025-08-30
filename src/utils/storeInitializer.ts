import type { InitialResponse } from "../entities/InitialResponse";
import {
  useDepartmentStore,
  useUnitStore,
  useCurrencyStore,
  useVendorStore,
  useLocationStore,
} from "../stores";
import { useCashDrawerStore } from "../stores/useCashDrawerStore";
import { useSettingsStore } from "../stores/useSettingsStore";

export const initializeStores = (initial_data: InitialResponse) => {
  const setDepartments = useDepartmentStore.getState().setDepartments;
  const setUnits = useUnitStore.getState().setUnits;
  const setCurrencies = useCurrencyStore.getState().setCurrencies;
  const setVendors = useVendorStore.getState().setVendors;
  const setLocations = useLocationStore.getState().setLocations;
  const setCashDrawers = useCashDrawerStore.getState().setCashDrawers;
  const setSettings = useSettingsStore.getState().setSettings;
  setDepartments(initial_data.departments);
  setUnits(initial_data.units)
  setCurrencies(initial_data.currencies)
  setVendors(initial_data.vendors)
  setLocations(initial_data.locations)
  setCashDrawers(initial_data.cash_drawers)
  setSettings(initial_data.settings)
};
