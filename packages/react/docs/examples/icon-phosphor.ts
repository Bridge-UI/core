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
  ColumnsIcon,
  DownloadSimpleIcon,
  EyeIcon,
  EyeSlashIcon,
  FunnelIcon,
  InfoIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PaletteIcon,
  PlusIcon,
  SidebarIcon,
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
  plus: PlusIcon,
  check: CheckIcon,
  clock: ClockIcon,
  minus: MinusIcon,
  error: XCircleIcon,
  filter: FunnelIcon,
  columns: ColumnsIcon,
  eyeOff: EyeSlashIcon,
  palette: PaletteIcon,
  warning: WarningIcon,
  loader: SpinnerGapIcon,
  chevronUp: CaretUpIcon,
  panelLeft: SidebarIcon,
  alert: WarningCircleIcon,
  success: CheckCircleIcon,
  chevronLeft: CaretLeftIcon,
  chevronDown: CaretDownIcon,
  calendar: CalendarDotsIcon,
  search: MagnifyingGlassIcon,
  download: DownloadSimpleIcon,
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
