/**
 * Example Phosphor Icons adapter for `@bridge-ui/react`.
 * Copy into your app or wire via `BridgeUIProvider` `global.icons`.
 * Not published as an npm package.
 */

// ** External Imports
import {
  BellIcon,
  CalendarDotsIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpDownIcon,
  CaretUpIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon,
  FunnelIcon,
  InfoIcon,
  PaletteIcon,
  SpinnerGapIcon,
  UserIcon,
  WarningCircleIcon,
  WarningIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { get } from "es-toolkit/compat";

// ** Core Imports
import type { IconAdapter, SemanticIconName } from "@bridge-ui/core/Adapters";

const icons = {
  eye: EyeIcon,
  clear: XIcon,
  bell: BellIcon,
  info: InfoIcon,
  user: UserIcon,
  check: CheckIcon,
  clock: ClockIcon,
  error: XCircleIcon,
  filter: FunnelIcon,
  eyeOff: EyeSlashIcon,
  palette: PaletteIcon,
  warning: WarningIcon,
  loader: SpinnerGapIcon,
  chevronUp: CaretUpIcon,
  alert: WarningCircleIcon,
  success: CheckCircleIcon,
  chevronLeft: CaretLeftIcon,
  chevronDown: CaretDownIcon,
  calendar: CalendarDotsIcon,
  chevronRight: CaretRightIcon,
  chevronUpDown: CaretUpDownIcon,
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
