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

export const SITING_FILLS: Record<string, string> = {
  "Permissive": "#4393c3",          // steel blue
  "Moderate Friction": "#8073ac",   // muted purple
  "Restrictive": "#d6604d",         // warm red
};

export const SITING_STROKES: Record<string, string> = {
  "Permissive": "#2166ac",
  "Moderate Friction": "#5e4fa2",
  "Restrictive": "#b2182b",
};
