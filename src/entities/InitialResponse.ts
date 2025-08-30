import type { CashDrawer } from "../entities/CashDrawer";
import type { Currency } from "../entities/Currency";
import type { Department } from "../entities/Department";
import type { Unit } from "../entities/Unit";
import type { Vendor } from "../entities/Vendor";
import type { Location } from "./Location";
import type { Setting } from "./Setting";


export interface InitialResponse {
  departments: Department[];
  units: Unit[];
  currencies: Currency[];
  vendors: Vendor[];
  locations: Location[];
  cash_drawers: CashDrawer[];
  settings: Setting;
}
