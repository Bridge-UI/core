/**
 * Heroicons (24px outline) adapter. Wire via `BridgeUIProvider` `global.icons`.
 * Requires the optional `@heroicons/react` peer.
 */

// ** External Imports
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  Bars3Icon,
  BellIcon,
  BoldIcon,
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CodeBracketIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  FunnelIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  InboxIcon,
  InformationCircleIcon,
  ItalicIcon,
  LinkIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  NumberedListIcon,
  PlusIcon,
  StarIcon,
  StrikethroughIcon,
  SwatchIcon,
  UnderlineIcon,
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
  bold: BoldIcon,
  link: LinkIcon,
  user: UserIcon,
  plus: PlusIcon,
  star: StarIcon,
  inbox: InboxIcon,
  clear: XMarkIcon,
  check: CheckIcon,
  clock: ClockIcon,
  minus: MinusIcon,
  heading1: H1Icon,
  heading2: H2Icon,
  heading3: H3Icon,
  error: XCircleIcon,
  filter: FunnelIcon,
  italic: ItalicIcon,
  palette: SwatchIcon,
  list: ListBulletIcon,
  eyeOff: EyeSlashIcon,
  panelLeft: Bars3Icon,
  code: CodeBracketIcon,
  loader: ArrowPathIcon,
  underline: UnderlineIcon,
  success: CheckCircleIcon,
  chevronUp: ChevronUpIcon,
  columns: ViewColumnsIcon,
  calendar: CalendarDaysIcon,
  refresh: ArrowUturnLeftIcon,
  download: ArrowDownTrayIcon,
  search: MagnifyingGlassIcon,
  info: InformationCircleIcon,
  alert: ExclamationCircleIcon,
  chevronDown: ChevronDownIcon,
  chevronLeft: ChevronLeftIcon,
  listOrdered: NumberedListIcon,
  chevronRight: ChevronRightIcon,
  strikethrough: StrikethroughIcon,
  chevronUpDown: ChevronUpDownIcon,
  warning: ExclamationTriangleIcon,
  chevronsLeft: ChevronDoubleLeftIcon,
  chevronsRight: ChevronDoubleRightIcon,
  quote: ChatBubbleBottomCenterTextIcon,
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
