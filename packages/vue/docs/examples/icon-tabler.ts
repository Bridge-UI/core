/**
 * Example Tabler Icons adapter for `@bridge-ui/vue`.
 * Copy into your app or wire via `BridgeUIProvider` / `createBridgeUI` `global.icons`.
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
  IconEye,
  IconEyeOff,
  IconFilter,
  IconInfoCircle,
  IconLoader2,
  IconPalette,
  IconSelector,
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
  user: IconUser,
  check: IconCheck,
  clock: IconClock,
  error: IconCircleX,
  eyeOff: IconEyeOff,
  filter: IconFilter,
  loader: IconLoader2,
  info: IconInfoCircle,
  palette: IconPalette,
  alert: IconAlertCircle,
  success: IconCircleCheck,
  chevronUp: IconChevronUp,
  warning: IconAlertTriangle,
  chevronUpDown: IconSelector,
  calendar: IconCalendarMonth,
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
