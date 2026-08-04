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
} from "@tabler/icons-react";
import { get } from "es-toolkit/compat";

// ** Core Imports
import type { IconAdapter, SemanticIconName } from "@bridge-ui/core";

const icons = {
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
