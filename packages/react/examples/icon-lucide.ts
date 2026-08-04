/**
 * Example Lucide icon adapter for `@bridge-ui/react`.
 * Copy into your app or wire via `BridgeUIProvider` `global.icons`.
 * Not published as an npm package.
 */

// ** External Imports
import { get } from "es-toolkit/compat";
import {
  Bell,
  Check,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CircleX,
  Eye,
  EyeOff,
  Info,
  Loader2,
  TriangleAlert,
  User,
  X,
} from "lucide-react";

// ** Core Imports
import type { IconAdapter, SemanticIconName } from "@bridge-ui/core";

const icons = {
  eye: Eye,
  clear: X,
  bell: Bell,
  info: Info,
  user: User,
  check: Check,
  error: CircleX,
  eyeOff: EyeOff,
  loader: Loader2,
  alert: CircleAlert,
  success: CircleCheck,
  chevronUp: ChevronUp,
  warning: TriangleAlert,
  chevronDown: ChevronDown,
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
