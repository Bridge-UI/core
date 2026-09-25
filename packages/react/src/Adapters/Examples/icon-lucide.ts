/**
 * Lucide icon adapter. Wire via `BridgeUIProvider` `global.icons`.
 * Requires the optional `lucide-react` peer.
 */

// ** External Imports
import { get } from "es-toolkit/compat";
import {
  Bell,
  Bold,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock,
  Code,
  Columns3,
  Download,
  Eye,
  EyeOff,
  Filter,
  Heading1,
  Heading2,
  Heading3,
  Inbox,
  Info,
  Italic,
  Link,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Palette,
  PanelLeft,
  Plus,
  Quote,
  RotateCcw,
  Search,
  Strikethrough,
  TriangleAlert,
  Underline,
  User,
  X,
} from "lucide-react";

// ** Core Imports
import type { IconAdapter, SemanticIconName } from "@bridge-ui/core/Adapters";

const icons = {
  eye: Eye,
  clear: X,
  bell: Bell,
  bold: Bold,
  code: Code,
  info: Info,
  link: Link,
  list: List,
  user: User,
  plus: Plus,
  check: Check,
  clock: Clock,
  inbox: Inbox,
  minus: Minus,
  quote: Quote,
  error: CircleX,
  eyeOff: EyeOff,
  filter: Filter,
  italic: Italic,
  search: Search,
  loader: Loader2,
  palette: Palette,
  columns: Columns3,
  refresh: RotateCcw,
  alert: CircleAlert,
  calendar: Calendar,
  download: Download,
  heading1: Heading1,
  heading2: Heading2,
  heading3: Heading3,
  success: CircleCheck,
  chevronUp: ChevronUp,
  panelLeft: PanelLeft,
  underline: Underline,
  warning: TriangleAlert,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  listOrdered: ListOrdered,
  chevronRight: ChevronRight,
  chevronsLeft: ChevronsLeft,
  strikethrough: Strikethrough,
  chevronsRight: ChevronsRight,
  chevronUpDown: ChevronsUpDown,
} satisfies Record<SemanticIconName, unknown>;

/**
 * Builds a Lucide-backed {@link IconAdapter} for Bridge semantic icon names.
 */
export function createLucideIconAdapter(): IconAdapter {
  return {
    resolve(name) {
      return get(icons, name);
    },
  };
}
