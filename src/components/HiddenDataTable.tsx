import type { ISODataPoint, XAxisMetric, PriceMetric, CapacityWeighting, GranularityLevel } from "../lib/types";
import type { YearKey } from "../App";
import { capacityPerGwPeak, capacityPerGwPeakElcc } from "../lib/types";
import { SR_ONLY } from "../lib/theme";

interface Props {
  data: ISODataPoint[];
  metric: XAxisMetric;
  priceMetric: PriceMetric;
  weighting: CapacityWeighting;
  granularity: GranularityLevel;
  year: YearKey;
}

export function HiddenDataTable({ data, metric: _metric, priceMetric: _priceMetric, weighting, granularity, year }: Props) {
  const isStateView = granularity === "state";
  const showElcc = weighting === "elcc";

  return (
    <div style={SR_ONLY}>
      <table>
        <caption>
          {isStateView ? "State" : "ISO"} electricity data for {year}
          {year === "2025" ? " (estimated)" : ""}
        </caption>
        <thead>
          <tr>
            <th>Name</th>
            {isStateView && <th>Region</th>}
            {isStateView && <th>Retail Price</th>}
            <th>Wholesale Price</th>
            <th>All-In Price</th>
            <th>New Capacity</th>
            {data.some((d) => d.retirements_mw != null) && <th>Retirements</th>}
            {data.some((d) => d.retirements_mw != null) && <th>Net Additions</th>}
            <th>Capacity/GW Peak</th>
            <th>Projects</th>
            <th>Peak Demand</th>
            <th>Queue Completion</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => {
            const perGw = showElcc ? capacityPerGwPeakElcc(d) : capacityPerGwPeak(d);
            const hasRetirements = d.retirements_mw != null;
            return (
              <tr key={d.id}>
                <td>{d.id} — {d.name}</td>
                {isStateView && <td>{d.region}</td>}
                {isStateView && <td>{d.retail_price_cents_kwh?.toFixed(1) ?? "—"}¢/kWh</td>}
                <td>${d.wholesale_price_mwh.toFixed(2)}/MWh</td>
                <td>${d.all_in_price_mwh.toFixed(2)}/MWh</td>
                <td>{d.capacity_additions_mw.toLocaleString()} MW</td>
                {data.some((dd) => dd.retirements_mw != null) && (
                  <td>{hasRetirements ? `${d.retirements_mw!.toLocaleString()} MW` : "—"}</td>
                )}
                {data.some((dd) => dd.retirements_mw != null) && (
                  <td>
                    {hasRetirements
                      ? `${(d.capacity_additions_mw - d.retirements_mw!).toLocaleString()} MW`
                      : "—"}
                  </td>
                )}
                <td>{perGw.toFixed(1)} MW/GW{showElcc ? " (ELCC)" : ""}</td>
                <td>{d.project_count}</td>
                <td>{d.peak_demand_gw.toFixed(1)} GW</td>
                <td>{d.queue_completion_pct}%{d.queue_cohort ? ` (${d.queue_cohort})` : ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
