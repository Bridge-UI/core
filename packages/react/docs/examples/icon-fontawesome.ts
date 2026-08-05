/**
 * Example Font Awesome 6 (free solid) adapter for `@bridge-ui/react`.
 * Copy into your app or wire via `BridgeUIProvider` `global.icons`.
 * Not published as an npm package.
 *
 * Font Awesome exports icon definitions, not SVG components. This adapter
 * `normalize`s them so `<Icon icon={faCoffee} />` works without a manual wrap.
 */

// ** External Imports
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBell,
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
  faEye,
  faEyeSlash,
  faSpinner,
  faTriangleExclamation,
  faUpDown,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get, isArray, isObject, isString, omit } from "es-toolkit/compat";
import {
  createElement,
  type ComponentPropsWithoutRef,
  type ComponentType,
  type SVGAttributes,
} from "react";

// ** Core Imports
import type { IconAdapter, SemanticIconName } from "@bridge-ui/core";

declare module "@bridge-ui/core" {
  interface IconSourceValueOverrides {
    fontAwesome: IconDefinition;
  }
}

type FontAwesomeIconBind = Omit<
  ComponentPropsWithoutRef<typeof FontAwesomeIcon>,
  "icon"
>;

type FaIconComponent = ComponentType<SVGAttributes<SVGSVGElement>>;

const faIconCache = new WeakMap<IconDefinition, FaIconComponent>();

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
 * Wraps a Font Awesome icon definition as a React SVG component.
 * Prefer `<Icon icon={faCoffee} />` with this adapter — `normalize` calls this.
 * Results are cached so repeated resolves keep a stable component identity.
 */
export function wrapFaIcon(icon: IconDefinition): FaIconComponent {
  const cached = faIconCache.get(icon);

  if (cached) {
    return cached;
  }

  function FaIcon(props: SVGAttributes<SVGSVGElement>) {
    // SVG `mask` / `transform` clash with Font Awesome's own prop types.
    const rest = omit(props, ["mask", "transform"]) as FontAwesomeIconBind;

    return createElement(FontAwesomeIcon, { ...rest, icon });
  }

  FaIcon.displayName = `FaIcon(${icon.iconName})`;
  faIconCache.set(icon, FaIcon);

  return FaIcon;
}

const icons = {
  eye: faEye,
  bell: faBell,
  user: faUser,
  clear: faXmark,
  check: faCheck,
  loader: faSpinner,
  info: faCircleInfo,
  eyeOff: faEyeSlash,
  error: faCircleXmark,
  success: faCircleCheck,
  chevronUp: faChevronUp,
  chevronUpDown: faUpDown,
  calendar: faCalendarDays,
  alert: faCircleExclamation,
  chevronDown: faChevronDown,
  chevronLeft: faChevronLeft,
  chevronRight: faChevronRight,
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
