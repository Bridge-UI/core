/**
 * Example Phosphor Icons adapter for `@bridge-ui/vue`.
 * Copy into your app or wire via `BridgeUIProvider` / `createBridgeUI` `global.icons`.
 * Not published as an npm package.
 */

// ** External Imports
import {
  PhBell,
  PhCaretDown,
  PhCaretUp,
  PhCaretUpDown,
  PhCheck,
  PhCheckCircle,
  PhEye,
  PhEyeSlash,
  PhInfo,
  PhSpinnerGap,
  PhUser,
  PhWarning,
  PhWarningCircle,
  PhX,
  PhXCircle,
} from "@phosphor-icons/vue";

// ** Core Imports
import { createIconAdapter, type IconAdapter } from "@bridge-ui/core";

/**
 * Builds a Phosphor-backed {@link IconAdapter} for Bridge semantic icon names.
 */
export function createPhosphorIconAdapter(): IconAdapter {
  return createIconAdapter({
    eye: PhEye,
    clear: PhX,
    bell: PhBell,
    info: PhInfo,
    user: PhUser,
    check: PhCheck,
    error: PhXCircle,
    eyeOff: PhEyeSlash,
    warning: PhWarning,
    loader: PhSpinnerGap,
    chevronUp: PhCaretUp,
    alert: PhWarningCircle,
    success: PhCheckCircle,
    chevronDown: PhCaretDown,
    chevronUpDown: PhCaretUpDown,
  });
}
