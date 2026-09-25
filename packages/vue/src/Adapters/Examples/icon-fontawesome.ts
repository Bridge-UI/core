/**
 * Font Awesome 6 (free solid) adapter. Wire via `BridgeUIProvider` /
 * `createBridgeUI` `global.icons`. Requires optional
 * `@fortawesome/vue-fontawesome`, `@fortawesome/fontawesome-svg-core`, and
 * `@fortawesome/free-solid-svg-icons`.
 *
 * Font Awesome exports icon definitions, not SVG components. This adapter
 * `normalize`s them so `<Icon :icon="faCoffee" />` works without a manual wrap.
 */

// ** External Imports
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faAnglesLeft,
  faAnglesRight,
  faBell,
  faBold,
  faCalendarDays,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faCircleXmark,
  faClock,
  faCode,
  faDownload,
  faEye,
  faEyeSlash,
  faFilter,
  faHeading,
  faInbox,
  faItalic,
  faLink,
  faListOl,
  faListUl,
  faMagnifyingGlass,
  faMinus,
  faPalette,
  faPlus,
  faQuoteLeft,
  faRotateRight,
  faSpinner,
  faStar,
  faStrikethrough,
  faTableColumns,
  faTriangleExclamation,
  faUnderline,
  faUpDown,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { get, isArray, isObject, isString } from "es-toolkit/compat";
import { defineComponent, h, type Component } from "vue";

// ** Core Imports
import type { IconAdapter, SemanticIconName } from "@bridge-ui/core/Adapters";

declare module "@bridge-ui/core/Adapters" {
  interface IconSourceValueOverrides {
    fontAwesome: IconDefinition;
  }
}

const faIconCache = new WeakMap<IconDefinition, Component>();

/**
 * Returns whether `value` looks like a Font Awesome {@link IconDefinition}.
 */
function isIconDefinition(value: unknown): value is IconDefinition {
  return (
    isObject(value) &&
    isArray((value as IconDefinition).icon) &&
    isString((value as IconDefinition).prefix) &&
    isString((value as IconDefinition).iconName)
  );
}

/**
 * Wraps a Font Awesome icon definition as a Vue SVG component.
 * Prefer `<Icon :icon="faCoffee" />` with this adapter — `normalize` calls this.
 * Results are cached so repeated resolves keep a stable component identity.
 */
export function wrapFaIcon(icon: IconDefinition): Component {
  const cached = faIconCache.get(icon);

  if (cached) {
    return cached;
  }

  const FaIcon = defineComponent({
    inheritAttrs: false,
    name: `FaIcon(${icon.iconName})`,
    setup(_, { attrs }) {
      return () => h(FontAwesomeIcon, { ...attrs, icon });
    },
  });

  faIconCache.set(icon, FaIcon);

  return FaIcon;
}

const icons = {
  eye: faEye,
  bell: faBell,
  bold: faBold,
  code: faCode,
  link: faLink,
  user: faUser,
  plus: faPlus,
  star: faStar,
  list: faListUl,
  inbox: faInbox,
  clear: faXmark,
  check: faCheck,
  clock: faClock,
  minus: faMinus,
  filter: faFilter,
  italic: faItalic,
  loader: faSpinner,
  info: faCircleInfo,
  eyeOff: faEyeSlash,
  palette: faPalette,
  quote: faQuoteLeft,
  heading1: faHeading,
  heading2: faHeading,
  heading3: faHeading,
  error: faCircleXmark,
  download: faDownload,
  listOrdered: faListOl,
  refresh: faRotateRight,
  success: faCircleCheck,
  chevronUp: faChevronUp,
  underline: faUnderline,
  columns: faTableColumns,
  chevronUpDown: faUpDown,
  calendar: faCalendarDays,
  panelLeft: faTableColumns,
  search: faMagnifyingGlass,
  alert: faCircleExclamation,
  chevronDown: faChevronDown,
  chevronLeft: faChevronLeft,
  chevronsLeft: faAnglesLeft,
  chevronRight: faChevronRight,
  chevronsRight: faAnglesRight,
  strikethrough: faStrikethrough,
  warning: faTriangleExclamation,
} satisfies Record<SemanticIconName, unknown>;

/**
 * Builds a Font Awesome-backed {@link IconAdapter} for Bridge semantic icon names.
 * Pass raw `fa*` definitions to `<Icon />` — they are normalized automatically.
 */
export function createFontAwesomeIconAdapter(): IconAdapter {
  return {
    resolve(name) {
      return get(icons, name);
    },
    normalize(source) {
      return isIconDefinition(source) ? wrapFaIcon(source) : source;
    },
  };
}
