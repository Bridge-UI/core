/**
 * Phosphor Icons adapter. Wire via `BridgeUIProvider` / `createBridgeUI` `global.icons`.
 * Requires the optional `@phosphor-icons/vue` peer.
 */

// ** External Imports
import {
  PhArrowClockwise,
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
  PhCode,
  PhColumns,
  PhDownloadSimple,
  PhEye,
  PhEyeSlash,
  PhFunnel,
  PhInfo,
  PhLink,
  PhListBullets,
  PhListNumbers,
  PhMagnifyingGlass,
  PhMinus,
  PhPalette,
  PhPlus,
  PhQuotes,
  PhSidebar,
  PhSpinnerGap,
  PhStar,
  PhTextB,
  PhTextHOne,
  PhTextHThree,
  PhTextHTwo,
  PhTextItalic,
  PhTextStrikethrough,
  PhTextUnderline,
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
  code: PhCode,
  info: PhInfo,
  link: PhLink,
  user: PhUser,
  plus: PhPlus,
  star: PhStar,
  bold: PhTextB,
  inbox: PhTray,
  check: PhCheck,
  clock: PhClock,
  minus: PhMinus,
  quote: PhQuotes,
  error: PhXCircle,
  filter: PhFunnel,
  columns: PhColumns,
  eyeOff: PhEyeSlash,
  palette: PhPalette,
  warning: PhWarning,
  list: PhListBullets,
  loader: PhSpinnerGap,
  italic: PhTextItalic,
  chevronUp: PhCaretUp,
  panelLeft: PhSidebar,
  heading1: PhTextHOne,
  heading2: PhTextHTwo,
  alert: PhWarningCircle,
  success: PhCheckCircle,
  heading3: PhTextHThree,
  chevronDown: PhCaretDown,
  chevronLeft: PhCaretLeft,
  calendar: PhCalendarDots,
  refresh: PhArrowClockwise,
  search: PhMagnifyingGlass,
  download: PhDownloadSimple,
  chevronRight: PhCaretRight,
  listOrdered: PhListNumbers,
  underline: PhTextUnderline,
  chevronUpDown: PhCaretUpDown,
  chevronsLeft: PhCaretDoubleLeft,
  chevronsRight: PhCaretDoubleRight,
  strikethrough: PhTextStrikethrough,
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
