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

/** Per-ISO colors for state view bubbles */
export const ISO_FILLS: Record<string, string> = {
  ERCOT:    "#4393c3",  // blue
  MISO:     "#66c2a5",  // teal
  SPP:      "#fc8d62",  // orange
  CAISO:    "#e78ac3",  // pink
  PJM:      "#8da0cb",  // periwinkle
  NYISO:    "#a6d854",  // lime
  "ISO-NE": "#ffd92f",  // gold
};

export const ISO_STROKES: Record<string, string> = {
  ERCOT:    "#2166ac",
  MISO:     "#1b9e77",
  SPP:      "#d95f02",
  CAISO:    "#c51b7d",
  PJM:      "#5e4fa2",
  NYISO:    "#4d9221",
  "ISO-NE": "#b8860b",
};
