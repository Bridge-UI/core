/**
 * Example Phosphor Icons adapter for `@bridge-ui/vue`.
 * Copy into your app or wire via `BridgeUIProvider` / `createBridgeUI` `global.icons`.
 * Not published as an npm package.
 */

// ** External Imports
import {
  PhBell,
  PhCalendarDots,
  PhCaretDown,
  PhCaretLeft,
  PhCaretRight,
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
import { get } from "es-toolkit/compat";

// ** Core Imports
import type { IconAdapter, SemanticIconName } from "@bridge-ui/core";

const icons = {
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
  chevronLeft: PhCaretLeft,
  calendar: PhCalendarDots,
  chevronRight: PhCaretRight,
  chevronUpDown: PhCaretUpDown,
} satisfies Record<SemanticIconName, unknown>;

/**
 * Builds a Phosphor-backed {@link IconAdapter} for Bridge semantic icon names.
 */
export function createPhosphorIconAdapter(): IconAdapter {
  return {
    resolve(name) {
      return get(icons, name);
    },
  };
}
