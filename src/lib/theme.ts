/** Academic economics chart aesthetic — serif titles, clean axes */

/** Semantic color tokens — consolidates ~14 raw hex grays into ~9 tokens */
export const COLOR = {
  text: {
    primary: "#1a1a1a",
    secondary: "#333",
    tertiary: "#555",
    muted: "#767676",
    disabled: "#999",
  },
  border: {
    strong: "#999",
    default: "#ccc",
    light: "#e0e0e0",
  },
  surface: {
    subtle: "#f5f5f5",
  },
  accent: {
    brand: "#2a9d8f",
    warning: "#e65100",
    error: "#b71c1c",
  },
} as const;

export const FONT = {
  title: "Georgia, 'Times New Roman', serif",
  body: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  brand: "'Space Mono', 'Courier New', monospace",
};

export const AXIS_STYLE = {
  tickLabelProps: {
    fontFamily: FONT.body,
    fontSize: 12,
    fill: COLOR.text.tertiary,
  },
  labelProps: {
    fontFamily: FONT.body,
    fontSize: 13,
    fill: COLOR.text.secondary,
    fontWeight: 500,
  },
  strokeColor: COLOR.border.default,
  tickStroke: COLOR.border.default,
};

/** Responsive axis style — tick/label sizes adapt to compact breakpoint */
export function getAxisStyle(compact?: boolean) {
  const tickFontSize = compact ? 11 : 12;
  const labelFontSize = compact ? 11.5 : 13;
  return {
    tickLabelProps: {
      fontFamily: FONT.body,
      fontSize: tickFontSize,
      fill: COLOR.text.tertiary,
    },
    labelProps: {
      fontFamily: FONT.body,
      fontSize: labelFontSize,
      fill: COLOR.text.secondary,
      fontWeight: 500,
    },
    strokeColor: COLOR.border.default,
    tickStroke: COLOR.border.default,
  };
}

export const GRID_STYLE = {
  stroke: COLOR.border.light,
  strokeDasharray: "2 3",
};

export const SR_ONLY: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};
