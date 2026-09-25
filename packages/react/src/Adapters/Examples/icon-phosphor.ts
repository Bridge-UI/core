/**
 * Phosphor Icons adapter. Wire via `BridgeUIProvider` `global.icons`.
 * Requires the optional `@phosphor-icons/react` peer.
 */

// ** External Imports
import {
  ArrowClockwiseIcon,
  BellIcon,
  CalendarDotsIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpDownIcon,
  CaretUpIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  CodeIcon,
  ColumnsIcon,
  DownloadSimpleIcon,
  EyeIcon,
  EyeSlashIcon,
  FunnelIcon,
  InfoIcon,
  LinkIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PaletteIcon,
  PlusIcon,
  QuotesIcon,
  SidebarIcon,
  SpinnerGapIcon,
  TextBIcon,
  TextHOneIcon,
  TextHThreeIcon,
  TextHTwoIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
  TrayIcon,
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
  code: CodeIcon,
  info: InfoIcon,
  link: LinkIcon,
  user: UserIcon,
  plus: PlusIcon,
  bold: TextBIcon,
  inbox: TrayIcon,
  check: CheckIcon,
  clock: ClockIcon,
  minus: MinusIcon,
  quote: QuotesIcon,
  error: XCircleIcon,
  filter: FunnelIcon,
  columns: ColumnsIcon,
  eyeOff: EyeSlashIcon,
  palette: PaletteIcon,
  warning: WarningIcon,
  list: ListBulletsIcon,
  loader: SpinnerGapIcon,
  italic: TextItalicIcon,
  chevronUp: CaretUpIcon,
  panelLeft: SidebarIcon,
  heading1: TextHOneIcon,
  heading2: TextHTwoIcon,
  alert: WarningCircleIcon,
  success: CheckCircleIcon,
  heading3: TextHThreeIcon,
  chevronLeft: CaretLeftIcon,
  chevronDown: CaretDownIcon,
  calendar: CalendarDotsIcon,
  refresh: ArrowClockwiseIcon,
  search: MagnifyingGlassIcon,
  download: DownloadSimpleIcon,
  chevronRight: CaretRightIcon,
  listOrdered: ListNumbersIcon,
  underline: TextUnderlineIcon,
  chevronUpDown: CaretUpDownIcon,
  chevronsLeft: CaretDoubleLeftIcon,
  chevronsRight: CaretDoubleRightIcon,
  strikethrough: TextStrikethroughIcon,
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
