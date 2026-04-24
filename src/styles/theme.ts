export const theme = {
  bg: "#0b1020",
  panel: "#141a33",
  panel2: "#1b2243",
  border: "#2a3260",
  text: "#e6e9f5",
  dim: "#8b93b8",
  primary: "#7c5cff",
  accent: "#28e0b9",
  warn: "#ffb547",
  danger: "#ff5c77",
  ok: "#4ade80",
};

export const chartPalette = [
  "#7c5cff",
  "#28e0b9",
  "#ffb547",
  "#ff5c77",
  "#4ade80",
  "#60a5fa",
  "#f472b6",
  "#facc15",
];

export const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  Telemetry: { bg: "rgba(124,92,255,0.15)", text: "#b7a5ff", border: "#7c5cff" },
  "User Experience": { bg: "rgba(40,224,185,0.15)", text: "#7ff0d3", border: "#28e0b9" },
  "Feature Analysis": { bg: "rgba(255,181,71,0.15)", text: "#ffd190", border: "#ffb547" },
  "Mixed Impact": { bg: "rgba(255,92,119,0.15)", text: "#ff9caf", border: "#ff5c77" },
};
