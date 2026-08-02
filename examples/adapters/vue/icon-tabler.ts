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
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconCircleCheck,
  IconCircleX,
  IconEye,
  IconEyeOff,
  IconInfoCircle,
  IconLoader2,
  IconSelector,
  IconUser,
  IconX,
} from "@tabler/icons-vue";

// ** Core Imports
import { createIconAdapter, type IconAdapter } from "@bridge-ui/core";

/**
 * Builds a Tabler-backed {@link IconAdapter} for Bridge semantic icon names.
 */
export function createTablerIconAdapter(): IconAdapter {
  return createIconAdapter({
    eye: IconEye,
    clear: IconX,
    bell: IconBell,
    user: IconUser,
    check: IconCheck,
    error: IconCircleX,
    eyeOff: IconEyeOff,
    loader: IconLoader2,
    info: IconInfoCircle,
    alert: IconAlertCircle,
    success: IconCircleCheck,
    chevronUp: IconChevronUp,
    warning: IconAlertTriangle,
    chevronUpDown: IconSelector,
    chevronDown: IconChevronDown,
  });
}
