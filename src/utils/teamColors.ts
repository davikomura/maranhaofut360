export interface TeamColorConfig {
  primary: string;
  secondary: string;
  glow: string;
}

export const DEFAULT_COLORS: TeamColorConfig = {
  primary: "#ef4444", // Tailwind red-500
  secondary: "#3b82f6", // Tailwind blue-500
  glow: "rgba(239, 68, 68, 0.15)",
};

export const TEAM_COLORS: Record<number, TeamColorConfig> = {
  1: { // Sampaio Corrêa
    primary: "#009639", // Green
    secondary: "#e30613", // Red
    glow: "rgba(0, 150, 57, 0.2)",
  },
  2: { // Moto Club
    primary: "#e30613", // Red
    secondary: "#111111", // Black
    glow: "rgba(227, 6, 19, 0.2)",
  },
  3: { // MAC
    primary: "#005ca9", // Blue
    secondary: "#e30613", // Red
    glow: "rgba(0, 92, 169, 0.2)",
  },
  4: { // Imperatriz
    primary: "#e30613", // Red
    secondary: "#005ca9", // Blue
    glow: "rgba(227, 6, 19, 0.2)",
  },
  5: { // Cordino
    primary: "#009639", // Green
    secondary: "#ffdd00", // Yellow
    glow: "rgba(0, 150, 57, 0.2)",
  },
  6: { // Pinheiro
    primary: "#008000", // Green
    secondary: "#ffffff", // White
    glow: "rgba(0, 128, 0, 0.2)",
  },
  7: { // Tuntum
    primary: "#005ca9", // Blue
    secondary: "#e30613", // Red
    glow: "rgba(0, 92, 169, 0.2)",
  },
  8: { // IAPE
    primary: "#ffdd00", // Yellow
    secondary: "#111111", // Black
    glow: "rgba(255, 221, 0, 0.15)",
  },
  9: { // Viana
    primary: "#008000", // Green
    secondary: "#e30613", // Red
    glow: "rgba(0, 128, 0, 0.2)",
  },
  10: { // Bacabal
    primary: "#005ca9", // Blue
    secondary: "#ffffff", // White
    glow: "rgba(0, 92, 169, 0.2)",
  },
  11: { // Expressinho
    primary: "#ffdd00", // Yellow
    secondary: "#111111", // Black
    glow: "rgba(255, 221, 0, 0.15)",
  },
  12: { // São José de Ribamar
    primary: "#005ca9", // Blue
    secondary: "#ffdd00", // Yellow
    glow: "rgba(0, 92, 169, 0.2)",
  },
  13: { // Tupan
    primary: "#e30613", // Red
    secondary: "#111111", // Black
    glow: "rgba(227, 6, 19, 0.2)",
  },
  14: { // Americano
    primary: "#e30613", // Red
    secondary: "#005ca9", // Blue
    glow: "rgba(227, 6, 19, 0.2)",
  },
  15: { // São Luís
    primary: "#005ca9", // Blue
    secondary: "#ffdd00", // Yellow
    glow: "rgba(0, 92, 169, 0.2)",
  },
  16: { // Santa Quitéria
    primary: "#008000", // Green
    secondary: "#ffdd00", // Yellow
    glow: "rgba(0, 128, 0, 0.2)",
  },
  17: { // Timon
    primary: "#ffdd00", // Yellow
    secondary: "#111111", // Black
    glow: "rgba(255, 221, 0, 0.15)",
  },
  18: { // Luso Brasileiro
    primary: "#e30613", // Red
    secondary: "#008000", // Green
    glow: "rgba(227, 6, 19, 0.2)",
  },
  19: { // Juventude Samas
    primary: "#ff6b00", // Orange
    secondary: "#005ca9", // Blue
    glow: "rgba(255, 107, 0, 0.2)",
  },
  20: { // Chapadinha
    primary: "#005ca9", // Blue
    secondary: "#ffdd00", // Yellow
    glow: "rgba(0, 92, 169, 0.2)",
  },
  21: { // Araioses
    primary: "#ffdd00", // Yellow
    secondary: "#008000", // Green
    glow: "rgba(255, 221, 0, 0.15)",
  },
  22: { // Balsas
    primary: "#005ca9", // Blue
    secondary: "#ffdd00", // Yellow
    glow: "rgba(0, 92, 169, 0.2)",
  },
  23: { // Sabiá
    primary: "#ffdd00", // Yellow
    secondary: "#e30613", // Red
    glow: "rgba(255, 221, 0, 0.15)",
  },
  24: { // JV Lideral
    primary: "#e30613", // Red
    secondary: "#ffdd00", // Yellow
    glow: "rgba(227, 6, 19, 0.2)",
  },
  25: { // Marília
    primary: "#005ca9", // Blue
    secondary: "#e30613", // Red
    glow: "rgba(0, 92, 169, 0.2)",
  },
  26: { // Sírio Brasileiro
    primary: "#008000", // Green
    secondary: "#ffffff", // White
    glow: "rgba(0, 128, 0, 0.2)",
  },
  27: { // Itz Sport
    primary: "#005ca9", // Blue
    secondary: "#ffffff", // White
    glow: "rgba(0, 92, 169, 0.2)",
  },
  28: { // Luminense
    primary: "#005ca9", // Blue
    secondary: "#e30613", // Red
    glow: "rgba(0, 92, 169, 0.2)",
  },
  29: { // Lago Verde
    primary: "#008000", // Green
    secondary: "#ffffff", // White
    glow: "rgba(0, 128, 0, 0.2)",
  },
};

export function getTeamColors(teamId: number): TeamColorConfig {
  return TEAM_COLORS[teamId] ?? DEFAULT_COLORS;
}
