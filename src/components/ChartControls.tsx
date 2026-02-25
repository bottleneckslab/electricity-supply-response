import type { YAxisMetric } from "../lib/types";
import { FONT } from "../lib/theme";

interface Props {
  metric: YAxisMetric;
  onChange: (m: YAxisMetric) => void;
}

const options: { value: YAxisMetric; label: string }[] = [
  { value: "capacity", label: "New Capacity (MW / GW peak)" },
  { value: "queue", label: "Queue Completion Rate (%)" },
];

export function ChartControls({ metric, onChange }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        fontFamily: FONT.body,
        fontSize: 13,
      }}
    >
      <span style={{ color: "#888", marginRight: 4, lineHeight: "30px" }}>
        X-axis:
      </span>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            padding: "4px 14px",
            border: "1px solid",
            borderColor: metric === o.value ? "#333" : "#ccc",
            borderRadius: 4,
            background: metric === o.value ? "#333" : "#fff",
            color: metric === o.value ? "#fff" : "#555",
            fontFamily: FONT.body,
            fontSize: 12.5,
            fontWeight: metric === o.value ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
