import { defaultStyles, TooltipWithBounds } from "@visx/tooltip";
import type { ISODataPoint, PriceMetric } from "../lib/types";
import { capacityPerGwPeak, projectsPerGwPeak } from "../lib/types";
import { FONT } from "../lib/theme";
import { GROUP_FILLS } from "../lib/colors";

interface Props {
  data: ISODataPoint;
  priceMetric: PriceMetric;
  top: number;
  left: number;
}

const tooltipStyles: React.CSSProperties = {
  ...defaultStyles,
  fontFamily: FONT.body,
  fontSize: 13,
  lineHeight: 1.5,
  padding: "12px 16px",
  maxWidth: 320,
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  border: "1px solid #ddd",
  borderRadius: 4,
};

export function ScatterTooltip({ data, priceMetric, top, left }: Props) {
  return (
    <TooltipWithBounds top={top} left={left} style={tooltipStyles}>
      <div
        style={{
          fontWeight: 700,
          fontSize: 14,
          marginBottom: 6,
          color: GROUP_FILLS[data.color_group],
        }}
      >
        {data.id}
      </div>
      <div style={{ color: "#666", fontSize: 12, marginBottom: 8 }}>
        {data.name} — {data.region}
      </div>
      <table style={{ fontSize: 12, borderCollapse: "collapse" }}>
        <tbody>
          <Row
            label="Wholesale price"
            value={`$${data.wholesale_price_mwh.toFixed(2)}/MWh`}
            highlight={priceMetric === "energy"}
          />
          <Row
            label="All-in price"
            value={`$${data.all_in_price_mwh.toFixed(2)}/MWh`}
            highlight={priceMetric === "all_in"}
          />
          <Row label="New capacity" value={`${data.capacity_additions_mw.toLocaleString()} MW`} />
          <Row label="Per GW peak" value={`${capacityPerGwPeak(data).toFixed(1)} MW/GW`} />
          <Row label="Projects" value={`${data.project_count}`} />
          <Row label="Per GW peak" value={`${projectsPerGwPeak(data).toFixed(1)} projects/GW`} />
          <Row label="Peak demand" value={`${data.peak_demand_gw.toFixed(1)} GW`} />
          <Row label="Queue completion" value={`${data.queue_completion_pct}%`} />
        </tbody>
      </table>
      <div
        style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: "1px solid #eee",
          fontSize: 11.5,
          color: "#555",
          fontStyle: "italic",
        }}
      >
        {data.qualitative_note}
      </div>
    </TooltipWithBounds>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <tr>
      <td style={{ color: "#888", paddingRight: 12, paddingBottom: 2 }}>{label}</td>
      <td
        style={{
          fontWeight: 600,
          color: highlight ? "#1a1a1a" : "#333",
          paddingBottom: 2,
          background: highlight ? "rgba(42, 157, 143, 0.08)" : undefined,
          borderRadius: highlight ? 2 : undefined,
          padding: highlight ? "0 4px 2px" : "0 0 2px",
        }}
      >
        {value}
      </td>
    </tr>
  );
}
