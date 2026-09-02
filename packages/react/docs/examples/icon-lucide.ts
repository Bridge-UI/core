/**
 * Example Lucide icon adapter for `@bridge-ui/react`.
 * Copy into your app or wire via `BridgeUIProvider` `global.icons`.
 * Not published as an npm package.
 */

// ** External Imports
import { get } from "es-toolkit/compat";
import {
  Bell,
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
  Columns3,
  Download,
  Eye,
  EyeOff,
  Filter,
  Inbox,
  Info,
  Loader2,
  Minus,
  Palette,
  PanelLeft,
  Plus,
  Search,
  TriangleAlert,
  User,
  X,
} from "lucide-react";

// ** Core Imports
import type { IconAdapter, SemanticIconName } from "@bridge-ui/core/Adapters";

const icons = {
  eye: Eye,
  clear: X,
  bell: Bell,
  info: Info,
  user: User,
  plus: Plus,
  check: Check,
  clock: Clock,
  inbox: Inbox,
  minus: Minus,
  error: CircleX,
  eyeOff: EyeOff,
  filter: Filter,
  search: Search,
  loader: Loader2,
  palette: Palette,
  columns: Columns3,
  alert: CircleAlert,
  calendar: Calendar,
  download: Download,
  success: CircleCheck,
  chevronUp: ChevronUp,
  panelLeft: PanelLeft,
  warning: TriangleAlert,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronsLeft: ChevronsLeft,
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
