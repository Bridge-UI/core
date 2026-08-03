/**
 * Example Phosphor Icons adapter for `@bridge-ui/react`.
 * Copy into your app or wire via `BridgeUIProvider` `global.icons`.
 * Not published as an npm package.
 */

// ** External Imports
import {
  BellIcon,
  CaretDownIcon,
  CaretUpDownIcon,
  CaretUpIcon,
  CheckCircleIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  InfoIcon,
  SpinnerGapIcon,
  UserIcon,
  WarningCircleIcon,
  WarningIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";

// ** Core Imports
import type { IconAdapter, SemanticIconName } from "@bridge-ui/core";

const icons = {
  eye: EyeIcon,
  clear: XIcon,
  bell: BellIcon,
  info: InfoIcon,
  user: UserIcon,
  check: CheckIcon,
  error: XCircleIcon,
  eyeOff: EyeSlashIcon,
  warning: WarningIcon,
  loader: SpinnerGapIcon,
  chevronUp: CaretUpIcon,
  alert: WarningCircleIcon,
  success: CheckCircleIcon,
  chevronDown: CaretDownIcon,
  chevronUpDown: CaretUpDownIcon,
} satisfies Record<SemanticIconName, unknown>;

/**
 * Builds a Phosphor-backed {@link IconAdapter} for Bridge semantic icon names.
 */
export function createPhosphorIconAdapter(): IconAdapter {
  return {
    resolve(name) {
      return icons[name];
    },
  };
}
