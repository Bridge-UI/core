/**
 * Example Font Awesome 6 (free solid) adapter for `@bridge-ui/vue`.
 * Copy into your app or wire via `BridgeUIProvider` / `createBridgeUI` `global.icons`.
 * Not published as an npm package.
 *
 * Font Awesome exports icon definitions, not SVG components — each entry is
 * wrapped so Bridge can render it with the usual `class` / SVG attrs.
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { defineComponent, h } from "vue";

// ** Core Imports
import { createIconAdapter, type IconAdapter } from "@bridge-ui/core";

/**
 * Wraps a Font Awesome icon definition as a Vue SVG component.
 * Use for ad-hoc `<Icon :icon="wrapFaIcon(faCoffee)" />` (definitions are not components).
 */
export function wrapFaIcon(icon: IconDefinition) {
  return defineComponent({
    inheritAttrs: false,
    name: `FaIcon(${icon.iconName})`,
    setup(_, { attrs }) {
      return () => h(FontAwesomeIcon, { ...attrs, icon });
    },
  });
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
