// ** Core Imports
import type { AlertColor } from "@bridge-ui/core/Tokens";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";

/** Library fallbacks when neither the `icon` prop nor theme `icon` is set. */
export const alertDefaultIcons: Record<keyof AlertColor, IconSource> = {
  dark: "info",
  info: "alert",
  error: "error",
  primary: "bell",
  secondary: "info",
  success: "success",
  warning: "warning",
};
