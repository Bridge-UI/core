/**
 * Example Lucide icon adapter for `@bridge-ui/react`.
 * Copy into your app or wire via `BridgeUIProvider` `global.icons`.
 * Not published as an npm package.
 */

// ** External Imports
import { get } from "es-toolkit/compat";
import {
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Palette,
  TriangleAlert,
  User,
  X,
} from "lucide-react";

// ** Core Imports
import type { IconAdapter, SemanticIconName } from "@bridge-ui/core/Adapters";

const icons = {
  eye: Eye,
  clear: X,
  bell: Bell,
  info: Info,
  user: User,
  check: Check,
  clock: Clock,
  error: CircleX,
  eyeOff: EyeOff,
  loader: Loader2,
  palette: Palette,
  alert: CircleAlert,
  calendar: Calendar,
  success: CircleCheck,
  chevronUp: ChevronUp,
  warning: TriangleAlert,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronUpDown: ChevronsUpDown,
} satisfies Record<SemanticIconName, unknown>;

/**
 * Builds a Lucide-backed {@link IconAdapter} for Bridge semantic icon names.
 */
export function createLucideIconAdapter(): IconAdapter {
  return {
    resolve(name) {
      return get(icons, name);
    },
  };
}
