export const COLORS = {
  primary: "#2563EB",
  primaryDark: "#1E40AF",
  secondary: "#10B981",
  danger: "#EF4444",
  background: "#F9FAFB",
  cardBg: "#FFFFFF",
  border: "#E5E7EB",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  shadow: "#000000",
} as const;

export type ColorKey = keyof typeof COLORS;
