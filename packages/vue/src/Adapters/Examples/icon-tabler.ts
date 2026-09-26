/**
 * Tabler Icons adapter. Wire via `BridgeUIProvider` / `createBridgeUI` `global.icons`.
 * Requires the optional `@tabler/icons-vue` peer.
 */

// ** External Imports
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconBell,
  IconBold,
  IconCalendarMonth,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconChevronUp,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconCode,
  IconColumns3,
  IconDownload,
  IconEye,
  IconEyeOff,
  IconFilter,
  IconH1,
  IconH2,
  IconH3,
  IconInbox,
  IconInfoCircle,
  IconItalic,
  IconLayoutSidebar,
  IconLink,
  IconList,
  IconListNumbers,
  IconLoader2,
  IconMinus,
  IconPalette,
  IconPlus,
  IconQuote,
  IconReload,
  IconSearch,
  IconSelector,
  IconStar,
  IconStrikethrough,
  IconUnderline,
  IconUser,
  IconX,
} from "@tabler/icons-vue";
import { get } from "es-toolkit/compat";

// ** Core Imports
import type { IconAdapter, SemanticIconName } from "@bridge-ui/core/Adapters";

const icons = {
  eye: IconEye,
  clear: IconX,
  bell: IconBell,
  bold: IconBold,
  code: IconCode,
  link: IconLink,
  list: IconList,
  user: IconUser,
  plus: IconPlus,
  star: IconStar,
  inbox: IconInbox,
  check: IconCheck,
  clock: IconClock,
  minus: IconMinus,
  quote: IconQuote,
  heading1: IconH1,
  heading2: IconH2,
  heading3: IconH3,
  error: IconCircleX,
  eyeOff: IconEyeOff,
  filter: IconFilter,
  italic: IconItalic,
  search: IconSearch,
  loader: IconLoader2,
  refresh: IconReload,
  info: IconInfoCircle,
  palette: IconPalette,
  columns: IconColumns3,
  alert: IconAlertCircle,
  download: IconDownload,
  success: IconCircleCheck,
  chevronUp: IconChevronUp,
  underline: IconUnderline,
  warning: IconAlertTriangle,
  chevronUpDown: IconSelector,
  calendar: IconCalendarMonth,
  panelLeft: IconLayoutSidebar,
  chevronDown: IconChevronDown,
  chevronLeft: IconChevronLeft,
  listOrdered: IconListNumbers,
  chevronRight: IconChevronRight,
  chevronsLeft: IconChevronsLeft,
  strikethrough: IconStrikethrough,
  chevronsRight: IconChevronsRight,
} satisfies Record<SemanticIconName, unknown>;

/**
 * Builds a Tabler-backed {@link IconAdapter} for Bridge semantic icon names.
 */
export function createTablerIconAdapter(): IconAdapter {
  return {
    resolve(name) {
      return get(icons, name);
    },
  };
}
