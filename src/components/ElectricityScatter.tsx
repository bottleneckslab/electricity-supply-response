import { useState, useCallback } from "react";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import { useTooltip } from "@visx/tooltip";
import type { ISODataPoint, YAxisMetric } from "../lib/types";
import { createScales, getXValue, getXLabel, getXSubtitle } from "../lib/scales";
import { GROUP_FILLS, GROUP_STROKES, SHADED_REGION } from "../lib/colors";
import { FONT, AXIS_STYLE, GRID_STYLE } from "../lib/theme";
import { ScatterTooltip } from "./ScatterTooltip";
import { ChartControls } from "./ChartControls";

const WIDTH = 820;
const HEIGHT = 580;
const MARGIN = { top: 60, right: 50, bottom: 88, left: 82 };

/**
 * Hand-tuned label offsets per ISO to avoid overlaps.
 * [dx, dy] relative to bubble center, in px.
 * Axes swapped: x = capacity/queue, y = price (Marshallian convention).
 */
const LABEL_OFFSETS: Record<string, Record<YAxisMetric, [number, number]>> = {
  ERCOT:    { capacity: [15, -30],  queue: [15, -22] },
  SPP:      { capacity: [15, -18],  queue: [15, -18] },
  MISO:     { capacity: [15, -10],  queue: [15, 8] },
  CAISO:    { capacity: [-55, -20], queue: [-55, -15] },
  PJM:      { capacity: [58, -15],  queue: [30, -55] },
  NYISO:    { capacity: [15, -22],  queue: [-52, -10] },
  "ISO-NE": { capacity: [-15, -18], queue: [-52, 8] },
};

interface Props {
  data: ISODataPoint[];
}

export function ElectricityScatter({ data }: Props) {
  const [metric, setMetric] = useState<YAxisMetric>("capacity");

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
  } = useTooltip<ISODataPoint>();

  const { xScale, yScale, rScale, xMax, yMax } = createScales(
    data,
    metric,
    WIDTH,
    HEIGHT,
    MARGIN,
  );

  const handleMouseEnter = useCallback(
    (d: ISODataPoint, cx: number, cy: number) => {
      showTooltip({
        tooltipData: d,
        tooltipLeft: cx + MARGIN.left,
        tooltipTop: cy + MARGIN.top,
      });
    },
    [showTooltip],
  );

  // Shaded "broken supply response" region — upper-left (high price, low building).
  // Capacity view: PJM, NYISO, ISO-NE. Queue view: PJM, CAISO, NYISO, ISO-NE.
  const shadedX1 = metric === "capacity"
    ? xScale(50)
    : xScale(16);
  const shadedY1 = yScale(32);

  return (
    <div style={{ position: "relative" }}>
      {/* Title block */}
      <div style={{ marginBottom: 2, paddingLeft: MARGIN.left }}>
        <h2
          style={{
            fontFamily: FONT.title,
            fontSize: 19,
            fontWeight: 700,
            color: "#1a1a1a",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          New Capacity vs. Wholesale Price Across RTOs/ISOs
        </h2>
        <p
          style={{
            fontFamily: FONT.body,
            fontSize: 13,
            color: "#666",
            margin: "2px 0 0",
          }}
        >
          {getXSubtitle(metric)}, 2024
        </p>
      </div>

      {/* Controls */}
      <div style={{ marginBottom: 4, paddingLeft: MARGIN.left }}>
        <ChartControls metric={metric} onChange={setMetric} />
      </div>

      {/* SVG chart */}
      <svg width={WIDTH} height={HEIGHT} style={{ overflow: "visible" }}>
        <Group top={MARGIN.top} left={MARGIN.left}>
          {/* Grid */}
          <GridRows
            scale={yScale}
            width={xMax}
            stroke={GRID_STYLE.stroke}
            strokeDasharray={GRID_STYLE.strokeDasharray}
          />
          <GridColumns
            scale={xScale}
            height={yMax}
            stroke={GRID_STYLE.stroke}
            strokeDasharray={GRID_STYLE.strokeDasharray}
          />

          {/* Shaded "broken supply response" region — upper-left */}
          <rect
            x={0}
            y={0}
            width={shadedX1}
            height={shadedY1}
            fill={SHADED_REGION.fill}
            stroke={SHADED_REGION.stroke}
            strokeDasharray={SHADED_REGION.strokeDasharray}
            strokeWidth={1.2}
            rx={4}
          />
          <text
            x={8}
            y={18}
            textAnchor="start"
            fontFamily={FONT.title}
            fontSize={12}
            fontStyle="italic"
            fill="#b2182b"
            opacity={0.6}
          >
            Broken supply response
          </text>

          {/* Bubbles */}
          {data.map((d) => {
            const cx = xScale(getXValue(d, metric)) ?? 0;
            const cy = yScale(d.wholesale_price_mwh) ?? 0;
            const r = rScale(d.peak_demand_gw);
            return (
              <g key={d.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={GROUP_FILLS[d.color_group]}
                  fillOpacity={0.55}
                  stroke={GROUP_STROKES[d.color_group]}
                  strokeWidth={1.5}
                  style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                  onMouseEnter={() => handleMouseEnter(d, cx, cy)}
                  onMouseLeave={hideTooltip}
                />
              </g>
            );
          })}

          {/* Direct labels */}
          {data.map((d) => {
            const cx = xScale(getXValue(d, metric)) ?? 0;
            const cy = yScale(d.wholesale_price_mwh) ?? 0;
            const [dx, dy] = LABEL_OFFSETS[d.id]?.[metric] ?? [15, -15];
            return (
              <text
                key={`label-${d.id}`}
                x={cx + dx}
                y={cy + dy}
                fontFamily={FONT.body}
                fontSize={12}
                fontWeight={600}
                fill={GROUP_STROKES[d.color_group]}
                style={{ pointerEvents: "none" }}
              >
                {d.id}
              </text>
            );
          })}

          {/* Axes */}
          <AxisBottom
            top={yMax}
            scale={xScale}
            label={getXLabel(metric)}
            stroke={AXIS_STYLE.strokeColor}
            tickStroke={AXIS_STYLE.tickStroke}
            tickLabelProps={() => AXIS_STYLE.tickLabelProps}
            labelProps={{
              ...AXIS_STYLE.labelProps,
              dy: 12,
            }}
            tickFormat={(v) =>
              metric === "queue" ? `${v}%` : String(v)
            }
          />
          <AxisLeft
            scale={yScale}
            label="Average Wholesale Price ($/MWh)"
            stroke={AXIS_STYLE.strokeColor}
            tickStroke={AXIS_STYLE.tickStroke}
            tickLabelProps={() => ({
              ...AXIS_STYLE.tickLabelProps,
              dx: -6,
              textAnchor: "end" as const,
            })}
            labelProps={{
              ...AXIS_STYLE.labelProps,
              dx: -28,
            }}
            tickFormat={(v) => `$${v}`}
          />
        </Group>

        {/* Footer */}
        <text
          x={WIDTH - MARGIN.right}
          y={HEIGHT - 8}
          textAnchor="end"
          fontFamily={FONT.body}
          fontSize={10}
          fill="#aaa"
        >
          Bottlenecks Lab · Data: EIA, ISO Market Monitor Reports, LBNL Queued Up 2025
        </text>

        {/* Bubble size legend — upper-right of chart area */}
        <Group top={MARGIN.top + 8} left={MARGIN.left + xMax - 230}>
          <text
            fontFamily={FONT.body}
            fontSize={10}
            fill="#999"
            dy={-6}
          >
            Bubble size = system peak demand
          </text>
          {[25, 80, 150].map((gw, i) => {
            const r = rScale(gw);
            const cx = i * 56 + 14;
            return (
              <g key={gw}>
                <circle
                  cx={cx}
                  cy={16}
                  r={r * 0.4}
                  fill="none"
                  stroke="#bbb"
                  strokeWidth={1}
                />
                <text
                  x={cx}
                  y={34}
                  textAnchor="middle"
                  fontFamily={FONT.body}
                  fontSize={9}
                  fill="#aaa"
                >
                  {gw} GW
                </text>
              </g>
            );
          })}
        </Group>
      </svg>

      {/* Tooltip */}
      {tooltipOpen && tooltipData && (
        <ScatterTooltip
          data={tooltipData}
          top={tooltipTop ?? 0}
          left={tooltipLeft ?? 0}
        />
      )}
    </div>
  );
}
