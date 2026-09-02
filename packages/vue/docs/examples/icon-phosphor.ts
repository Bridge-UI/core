/**
 * Example Phosphor Icons adapter for `@bridge-ui/vue`.
 * Copy into your app or wire via `BridgeUIProvider` / `createBridgeUI` `global.icons`.
 * Not published as an npm package.
 */

// ** External Imports
import {
  PhBell,
  PhCalendarDots,
  PhCaretDoubleLeft,
  PhCaretDoubleRight,
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
  PhSidebar,
  PhSpinnerGap,
  PhTray,
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
  inbox: PhTray,
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
  panelLeft: PhSidebar,
  alert: PhWarningCircle,
  success: PhCheckCircle,
  chevronDown: PhCaretDown,
  chevronLeft: PhCaretLeft,
  calendar: PhCalendarDots,
  search: PhMagnifyingGlass,
  download: PhDownloadSimple,
  chevronRight: PhCaretRight,
  chevronUpDown: PhCaretUpDown,
  chevronsLeft: PhCaretDoubleLeft,
  chevronsRight: PhCaretDoubleRight,
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
