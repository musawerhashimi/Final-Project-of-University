
export interface Unit {
  id: number;
  name: string;
  abbreviation: string;
  unit_type: "weight" | "volume" | "length" | "area" | "count" | "time";
  base_unit: number; // id of base unit
  conversion_factor: number;
  is_base_unit: boolean;
}
