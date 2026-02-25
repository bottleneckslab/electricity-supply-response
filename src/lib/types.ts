export type ColorGroup = "functional" | "intermediate" | "broken";

export type XAxisMetric = "capacity" | "queue" | "projects";

export type PriceMetric = "energy" | "all_in";

/** @deprecated Use XAxisMetric instead */
export type YAxisMetric = XAxisMetric;

export interface ISODataPoint {
  id: string;
  name: string;
  region: string;
  wholesale_price_mwh: number;
  all_in_price_mwh: number;
  capacity_additions_mw: number;
  project_count: number;
  peak_demand_gw: number;
  queue_completion_pct: number;
  color_group: ColorGroup;
  qualitative_note: string;
  sources: {
    price: string;
    capacity: string;
    peak: string;
    queue: string;
  };
}

export interface ISOScatterDataset {
  metadata: {
    title: string;
    author: string;
    compiled: string;
    primary_year: number;
    notes: string;
  };
  isos: ISODataPoint[];
}

/** Derived metric: MW of new capacity per GW of system peak */
export function capacityPerGwPeak(d: ISODataPoint): number {
  return d.capacity_additions_mw / d.peak_demand_gw;
}

/** Derived metric: distinct generators per GW of system peak */
export function projectsPerGwPeak(d: ISODataPoint): number {
  return d.project_count / d.peak_demand_gw;
}
