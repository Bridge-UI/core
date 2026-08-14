/**
 * Example Heroicons adapter for `@bridge-ui/react` (24px outline).
 * Copy into your app or wire via `BridgeUIProvider` `global.icons`.
 * Not published as an npm package.
 */

// ** External Imports
import {
  ArrowPathIcon,
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
  InformationCircleIcon,
  UserIcon,
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
  clear: XMarkIcon,
  check: CheckIcon,
  clock: ClockIcon,
  error: XCircleIcon,
  eyeOff: EyeSlashIcon,
  loader: ArrowPathIcon,
  success: CheckCircleIcon,
  chevronUp: ChevronUpIcon,
  calendar: CalendarDaysIcon,
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
