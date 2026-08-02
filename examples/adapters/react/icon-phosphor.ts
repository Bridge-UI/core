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
import { createIconAdapter, type IconAdapter } from "@bridge-ui/core";

/**
 * Builds a Phosphor-backed {@link IconAdapter} for Bridge semantic icon names.
 */
export function createPhosphorIconAdapter(): IconAdapter {
  return createIconAdapter({
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
  });
}
