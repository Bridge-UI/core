/**
 * Example Heroicons adapter for `@bridge-ui/react` (24px outline).
 * Copy into your app or wire via `BridgeUIProvider` `global.icons`.
 * Not published as an npm package.
 */

// ** External Imports
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  Bars3Icon,
  BellIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  FunnelIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PlusIcon,
  SwatchIcon,
  UserIcon,
  ViewColumnsIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { get } from "es-toolkit/compat";

// ** Core Imports
import type { IconAdapter, SemanticIconName } from "@bridge-ui/core/Adapters";

const icons = {
  eye: EyeIcon,
  bell: BellIcon,
  user: UserIcon,
  plus: PlusIcon,
  clear: XMarkIcon,
  check: CheckIcon,
  clock: ClockIcon,
  minus: MinusIcon,
  error: XCircleIcon,
  filter: FunnelIcon,
  palette: SwatchIcon,
  eyeOff: EyeSlashIcon,
  panelLeft: Bars3Icon,
  loader: ArrowPathIcon,
  success: CheckCircleIcon,
  chevronUp: ChevronUpIcon,
  columns: ViewColumnsIcon,
  calendar: CalendarDaysIcon,
  download: ArrowDownTrayIcon,
  search: MagnifyingGlassIcon,
  info: InformationCircleIcon,
  alert: ExclamationCircleIcon,
  chevronDown: ChevronDownIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  warning: ExclamationTriangleIcon,
  chevronUpDown: ChevronUpDownIcon,
} satisfies Record<SemanticIconName, unknown>;

/**
 * Builds a Heroicons-backed {@link IconAdapter} for Bridge semantic icon names.
 */
export function createHeroiconsIconAdapter(): IconAdapter {
  return {
    resolve(name) {
      return get(icons, name);
    },
  };
}
