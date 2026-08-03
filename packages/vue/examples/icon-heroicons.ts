/**
 * Example Heroicons adapter for `@bridge-ui/vue` (24px outline).
 * Copy into your app or wire via `BridgeUIProvider` / `createBridgeUI` `global.icons`.
 * Not published as an npm package.
 */

// ** External Imports
import {
  ArrowPathIcon,
  BellIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon,
  UserIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

// ** Core Imports
import type { IconAdapter, SemanticIconName } from "@bridge-ui/core";

const icons = {
  eye: EyeIcon,
  bell: BellIcon,
  user: UserIcon,
  clear: XMarkIcon,
  check: CheckIcon,
  error: XCircleIcon,
  eyeOff: EyeSlashIcon,
  loader: ArrowPathIcon,
  success: CheckCircleIcon,
  chevronUp: ChevronUpIcon,
  info: InformationCircleIcon,
  alert: ExclamationCircleIcon,
  chevronDown: ChevronDownIcon,
  warning: ExclamationTriangleIcon,
  chevronUpDown: ChevronUpDownIcon,
} satisfies Record<SemanticIconName, unknown>;

/**
 * Builds a Heroicons-backed {@link IconAdapter} for Bridge semantic icon names.
 */
export function createHeroiconsIconAdapter(): IconAdapter {
  return {
    resolve(name) {
      return icons[name];
    },
  };
}
