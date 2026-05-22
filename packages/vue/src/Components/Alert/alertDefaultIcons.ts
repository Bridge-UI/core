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
import type { AlertColor } from "@bridge-ui/core/Components/Alert";

/** Library fallbacks when neither the `icon` prop nor theme `icon` is set. */
export const alertDefaultIcons: Record<keyof AlertColor, LucideIcon> = {
  dark: Info,
  primary: Bell,
  error: CircleX,
  secondary: Info,
  info: CircleAlert,
  success: CircleCheck,
  warning: TriangleAlert,
};
