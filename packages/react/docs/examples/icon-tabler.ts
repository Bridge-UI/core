/**
 * Example Tabler Icons adapter for `@bridge-ui/react`.
 * Copy into your app or wire via `BridgeUIProvider` `global.icons`.
 * Not published as an npm package.
 */

// ** External Imports
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconBell,
  IconCalendarMonth,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconColumns3,
  IconDownload,
  IconEye,
  IconEyeOff,
  IconFilter,
  IconInbox,
  IconInfoCircle,
  IconLayoutSidebar,
  IconLoader2,
  IconMinus,
  IconPalette,
  IconPlus,
  IconSearch,
  IconSelector,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { get } from "es-toolkit/compat";

// ** Core Imports
import type { IconAdapter, SemanticIconName } from "@bridge-ui/core/Adapters";

const icons = {
  eye: IconEye,
  clear: IconX,
  bell: IconBell,
  user: IconUser,
  plus: IconPlus,
  inbox: IconInbox,
  check: IconCheck,
  clock: IconClock,
  minus: IconMinus,
  error: IconCircleX,
  eyeOff: IconEyeOff,
  filter: IconFilter,
  search: IconSearch,
  loader: IconLoader2,
  info: IconInfoCircle,
  palette: IconPalette,
  columns: IconColumns3,
  alert: IconAlertCircle,
  download: IconDownload,
  success: IconCircleCheck,
  chevronUp: IconChevronUp,
  warning: IconAlertTriangle,
  chevronUpDown: IconSelector,
  calendar: IconCalendarMonth,
  panelLeft: IconLayoutSidebar,
  chevronDown: IconChevronDown,
  chevronLeft: IconChevronLeft,
  chevronRight: IconChevronRight,
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
