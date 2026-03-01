import type { ViewTab, PriceMetric, CapacityWeighting } from "../lib/types";
import type { YearKey } from "../App";
import { FONT } from "../lib/theme";

interface Props {
  compact?: boolean;
  viewTab: ViewTab;
  priceMetric: PriceMetric;
  weighting: CapacityWeighting;
  year: YearKey;
  availableYears: YearKey[];
  playing: boolean;
  onViewTabChange: (t: ViewTab) => void;
  onPriceMetricChange: (m: PriceMetric) => void;
  onWeightingChange: (w: CapacityWeighting) => void;
  onYearChange: (y: YearKey) => void;
  onPlayToggle: () => void;
}

const tabOptions: { value: ViewTab; label: string }[] = [
  { value: "capacity", label: "RTO/ISO Capacity \u00d7 Price" },
  { value: "queue", label: "RTO/ISO Queue \u00d7 Price" },
  { value: "state", label: "State Capacity \u00d7 Price" },
];

const priceOptions: { value: PriceMetric; label: string }[] = [
  { value: "energy", label: "Energy-Only" },
  { value: "all_in", label: "All-In" },
];

const weightingOptions: { value: CapacityWeighting; label: string }[] = [
  { value: "nameplate", label: "Nameplate" },
  { value: "elcc", label: "ELCC" },
];

const yearLabels: Record<YearKey, string> = {
  "2023": "2023",
  "2024": "2024",
  "2025": "2025 (est.)",
};

function ToggleButton<T extends string>({
  value,
  label,
  active,
  onClick,
  padding = "4px 14px",
  fontSize = 12.5,
}: {
  value: T;
  label: string;
  active: boolean;
  onClick: (v: T) => void;
  padding?: string;
  fontSize?: number;
}) {
  return (
    <button
      onClick={() => onClick(value)}
      aria-pressed={active}
      style={{
        padding,
        minHeight: 36,
        border: "1px solid",
        borderColor: active ? "#333" : "#999",
        borderRadius: 4,
        background: active ? "#333" : "#fff",
        color: active ? "#fff" : "#555",
        fontFamily: FONT.body,
        fontSize,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}

export function ChartControls({
  compact,
  viewTab,
  priceMetric,
  weighting,
  year,
  availableYears,
  playing,
  onViewTabChange,
  onPriceMetricChange,
  onWeightingChange,
  onYearChange,
  onPlayToggle,
}: Props) {
  const rowStyle: React.CSSProperties = {
    display: "flex",
    gap: 4,
    alignItems: "center",
    flexWrap: compact ? "wrap" : undefined,
  };
  const labelStyle: React.CSSProperties = {
    color: "#767676",
    marginRight: 4,
    lineHeight: "30px",
    minWidth: compact ? undefined : 80,
    width: compact ? "100%" : undefined,
    fontSize: compact ? 11 : undefined,
  };
  const btnPadding = compact ? "6px 10px" : "6px 14px";
  const btnFontSize = compact ? 11.5 : 12.5;

  const isIsoView = viewTab !== "state";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        fontFamily: FONT.body,
        fontSize: compact ? 11 : 13,
      }}
    >
      {/* Primary tabs */}
      <div style={rowStyle}>
        {tabOptions.map((o) => (
          <ToggleButton
            key={o.value}
            value={o.value}
            label={o.label}
            active={viewTab === o.value}
            onClick={onViewTabChange}
            padding={btnPadding}
            fontSize={btnFontSize}
          />
        ))}
      </div>
      {/* Year */}
      <div style={rowStyle}>
        <span style={labelStyle}>Year:</span>
        {availableYears.map((y) => (
          <ToggleButton
            key={y}
            value={y}
            label={yearLabels[y]}
            active={year === y}
            onClick={onYearChange}
            padding={btnPadding}
            fontSize={btnFontSize}
          />
        ))}
        <button
          onClick={onPlayToggle}
          aria-label={playing ? "Pause year animation" : "Play through years"}
          aria-pressed={playing}
          title={playing ? "Pause" : "Play through years"}
          style={{
            marginLeft: 8,
            padding: compact ? "6px 8px" : "6px 10px",
            border: "1px solid",
            borderColor: playing ? "#2a9d8f" : "#999",
            borderRadius: 4,
            background: playing ? "rgba(42, 157, 143, 0.08)" : "#fff",
            color: playing ? "#2a9d8f" : "#767676",
            fontFamily: FONT.body,
            fontSize: compact ? 13 : 14,
            fontWeight: 400,
            cursor: "pointer",
            transition: "all 0.15s ease",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: compact ? 36 : 36,
            height: compact ? 36 : 36,
          }}
        >
          {playing ? "\u23F8" : "\u25B6"}
        </button>
      </div>
      {/* Capacity basis — capacity + state tabs */}
      {viewTab !== "queue" && (
        <div style={rowStyle}>
          <span style={labelStyle}>Capacity basis:</span>
          {weightingOptions.map((o) => (
            <ToggleButton
              key={o.value}
              value={o.value}
              label={o.label}
              active={weighting === o.value}
              onClick={onWeightingChange}
              padding={btnPadding}
              fontSize={btnFontSize}
            />
          ))}
        </div>
      )}
      {/* Price basis — ISO tabs only (capacity + queue) */}
      {isIsoView && (
        <div style={rowStyle}>
          <span style={labelStyle}>Price basis:</span>
          {priceOptions.map((o) => (
            <ToggleButton
              key={o.value}
              value={o.value}
              label={o.label}
              active={priceMetric === o.value}
              onClick={onPriceMetricChange}
              padding={btnPadding}
              fontSize={btnFontSize}
            />
          ))}
        </div>
      )}
    </div>
  );
}
