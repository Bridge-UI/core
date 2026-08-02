// ** Core Imports
import type { SnackbarColor } from "@bridge-ui/core/Tokens/Snackbar";

// ** Local Imports
import type { IconSource } from "@/Icons";

/** Library fallbacks when neither the `icon` prop nor theme `icon` is set. */
export const snackbarDefaultIcons: Record<keyof SnackbarColor, IconSource> = {
  dark: "info",
  info: "alert",
  error: "error",
  primary: "bell",
  secondary: "info",
  success: "success",
  warning: "warning",
};
