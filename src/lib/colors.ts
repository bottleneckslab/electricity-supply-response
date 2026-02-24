import type { ColorGroup } from "./types";

export const GROUP_FILLS: Record<ColorGroup, string> = {
  functional: "#4393c3",   // steel blue
  intermediate: "#8073ac", // muted purple
  broken: "#d6604d",       // warm red
};

export const GROUP_STROKES: Record<ColorGroup, string> = {
  functional: "#2166ac",
  intermediate: "#5e4fa2",
  broken: "#b2182b",
};

export const SHADED_REGION = {
  fill: "rgba(214, 96, 77, 0.06)",
  stroke: "#b2182b",
  strokeDasharray: "6 4",
};
