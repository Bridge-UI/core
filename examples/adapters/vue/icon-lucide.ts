/**
 * Example Lucide icon adapter for `@bridge-ui/vue`.
 * Copy into your app or wire via `BridgeUIProvider` / `createBridgeUI` `global.icons`.
 * Not published as an npm package.
 */

// ** External Imports
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
} from "@lucide/vue";

// ** Core Imports
import { createIconAdapter, type IconAdapter } from "@bridge-ui/core";

/**
 * Builds a Lucide-backed {@link IconAdapter} for Bridge semantic icon names.
 */
export function createLucideIconAdapter(): IconAdapter {
  return createIconAdapter({
    eye: Eye,
    bell: Bell,
    info: Info,
    user: User,
    alert: CircleAlert,
    check: Check,
    clear: X,
    error: CircleX,
    eyeOff: EyeOff,
    loader: Loader2,
    success: CircleCheck,
    warning: TriangleAlert,
    chevronUp: ChevronUp,
    chevronDown: ChevronDown,
    chevronUpDown: ChevronsUpDown,
  });
}
