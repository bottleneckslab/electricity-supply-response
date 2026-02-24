import { defaultStyles, TooltipWithBounds } from "@visx/tooltip";
import type { ISODataPoint } from "../lib/types";
import { capacityPerGwPeak } from "../lib/types";
import { FONT } from "../lib/theme";
import { GROUP_FILLS } from "../lib/colors";

interface Props {
  data: ISODataPoint;
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

export function ScatterTooltip({ data, top, left }: Props) {
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
          <Row label="Wholesale price" value={`$${data.wholesale_price_mwh.toFixed(2)}/MWh`} />
          <Row label="New capacity" value={`${data.capacity_additions_mw.toLocaleString()} MW`} />
          <Row label="Per GW peak" value={`${capacityPerGwPeak(data).toFixed(1)} MW/GW`} />
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={{ color: "#888", paddingRight: 12, paddingBottom: 2 }}>{label}</td>
      <td style={{ fontWeight: 600, color: "#333", paddingBottom: 2 }}>{value}</td>
    </tr>
  );
}
