/**
 * Example Font Awesome 6 (free solid) adapter for `@bridge-ui/react`.
 * Copy into your app or wire via `BridgeUIProvider` `global.icons`.
 * Not published as an npm package.
 *
 * Font Awesome exports icon definitions, not SVG components — each entry is
 * wrapped so Bridge can render it with the usual `className` / SVG attrs.
 */

// ** External Imports
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBell,
  faCheck,
  faChevronDown,
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
import { omit } from "es-toolkit/compat";
import {
  createElement,
  type ComponentPropsWithoutRef,
  type SVGAttributes,
} from "react";

// ** Core Imports
import { createIconAdapter, type IconAdapter } from "@bridge-ui/core";

type FontAwesomeIconBind = Omit<
  ComponentPropsWithoutRef<typeof FontAwesomeIcon>,
  "icon"
>;

/**
 * Wraps a Font Awesome icon definition as a React SVG component.
 * Use for ad-hoc `<Icon icon={wrapFaIcon(faCoffee)} />` (definitions are not components).
 */
export function wrapFaIcon(icon: IconDefinition) {
  function FaIcon(props: SVGAttributes<SVGSVGElement>) {
    // SVG `mask` / `transform` clash with Font Awesome's own prop types.
    const rest = omit(props, ["mask", "transform"]) as FontAwesomeIconBind;

    return createElement(FontAwesomeIcon, { ...rest, icon });
  }

  FaIcon.displayName = `FaIcon(${icon.iconName})`;

  return FaIcon;
}

/**
 * Builds a Font Awesome-backed {@link IconAdapter} for Bridge semantic icon names.
 */
export function createFontAwesomeIconAdapter(): IconAdapter {
  return createIconAdapter({
    eye: wrapFaIcon(faEye),
    bell: wrapFaIcon(faBell),
    user: wrapFaIcon(faUser),
    clear: wrapFaIcon(faXmark),
    check: wrapFaIcon(faCheck),
    loader: wrapFaIcon(faSpinner),
    info: wrapFaIcon(faCircleInfo),
    eyeOff: wrapFaIcon(faEyeSlash),
    error: wrapFaIcon(faCircleXmark),
    success: wrapFaIcon(faCircleCheck),
    chevronUp: wrapFaIcon(faChevronUp),
    chevronUpDown: wrapFaIcon(faUpDown),
    alert: wrapFaIcon(faCircleExclamation),
    chevronDown: wrapFaIcon(faChevronDown),
    warning: wrapFaIcon(faTriangleExclamation),
  });
}
