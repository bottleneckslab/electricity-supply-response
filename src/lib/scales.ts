import { scaleLinear, scaleSqrt } from "@visx/scale";
import type { ISODataPoint, YAxisMetric } from "./types";
import { capacityPerGwPeak } from "./types";

export function getXValue(d: ISODataPoint, metric: YAxisMetric): number {
  if (metric === "queue") return d.queue_completion_pct;
  return capacityPerGwPeak(d);
}

export function getXLabel(metric: YAxisMetric): string {
  if (metric === "queue") return "Queue Completion Rate (%)";
  return "New Capacity (MW per GW of System Peak)";
}

export function getXSubtitle(metric: YAxisMetric): string {
  if (metric === "queue")
    return "Share of Interconnection Requests Reaching Commercial Operation";
  return "Annual New Generation Reaching Commercial Operation (MW per GW of System Peak)";
}

export function createScales(
  data: ISODataPoint[],
  metric: YAxisMetric,
  width: number,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number },
) {
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xValues = data.map((d) => getXValue(d, metric));
  const priceValues = data.map((d) => d.wholesale_price_mwh);
  const peakValues = data.map((d) => d.peak_demand_gw);

  // X-axis: capacity metric (supply response)
  const xScale = scaleLinear<number>({
    domain: [0, Math.max(...xValues) * 1.15],
    range: [0, xMax],
    nice: true,
  });

  // Y-axis: price (Marshallian convention — P on y)
  const yScale = scaleLinear<number>({
    domain: [
      Math.min(...priceValues) - 3,
      Math.max(...priceValues) + 3,
    ],
    range: [yMax, 0],
    nice: true,
  });

  const rScale = scaleSqrt<number>({
    domain: [Math.min(...peakValues), Math.max(...peakValues)],
    range: [14, 48],
  });

  return { xScale, yScale, rScale, xMax, yMax };
}
