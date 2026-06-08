// ** External Imports
import type { LucideIcon } from "lucide-vue-next";
import {
  Bell,
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  TriangleAlert,
} from "lucide-vue-next";

// ** Core Imports
import type { SnackbarColor } from "@bridge-ui/core";

/** Library fallbacks when neither the `icon` prop nor theme `icon` is set. */
export const snackbarDefaultIcons: Record<keyof SnackbarColor, LucideIcon> = {
  dark: Info,
  primary: Bell,
  error: CircleX,
  secondary: Info,
  info: CircleAlert,
  success: CircleCheck,
  warning: TriangleAlert,
};
