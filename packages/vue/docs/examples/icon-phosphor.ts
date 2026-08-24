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
  PhClock,
  PhColumns,
  PhDownloadSimple,
  PhEye,
  PhEyeSlash,
  PhFunnel,
  PhInfo,
  PhMagnifyingGlass,
  PhMinus,
  PhPalette,
  PhPlus,
  PhSpinnerGap,
  PhUser,
  PhWarning,
  PhWarningCircle,
  PhX,
  PhXCircle,
} from "@phosphor-icons/vue";
import { get } from "es-toolkit/compat";

// ** Core Imports
import type { IconAdapter, SemanticIconName } from "@bridge-ui/core/Adapters";

const icons = {
  eye: PhEye,
  clear: PhX,
  bell: PhBell,
  info: PhInfo,
  user: PhUser,
  plus: PhPlus,
  check: PhCheck,
  clock: PhClock,
  minus: PhMinus,
  error: PhXCircle,
  filter: PhFunnel,
  columns: PhColumns,
  eyeOff: PhEyeSlash,
  palette: PhPalette,
  warning: PhWarning,
  loader: PhSpinnerGap,
  chevronUp: PhCaretUp,
  alert: PhWarningCircle,
  success: PhCheckCircle,
  chevronDown: PhCaretDown,
  chevronLeft: PhCaretLeft,
  calendar: PhCalendarDots,
  search: PhMagnifyingGlass,
  download: PhDownloadSimple,
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
