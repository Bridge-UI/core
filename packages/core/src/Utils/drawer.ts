// ** External Imports
import { get, isNil, isString } from "es-toolkit/compat";

// ** Local Imports
import {
  transitionProps,
  type DrawerPlacement,
  type DrawerSlidePanel,
  type DrawerTransition,
} from "@/Components/Drawer";
import { hasWindow } from "@/Utils/env";

/**
 * Fallback ms to finish leave when `transitionend` never fires.
 * Matches `duration-300` drawer transitions with a small buffer.
 */
export const DRAWER_LEAVE_FALLBACK_MS = 350;

/**
 * How many layers fire `transitionend` on leave (overlay + panel when animated).
 */
export function countDrawerTransitionLayers(
  transition: keyof DrawerTransition,
  options: { hideBackdrop?: boolean } = {},
): number {
  if (!hasDrawerTransition(transition)) {
    return 0;
  }

  return options.hideBackdrop ? 1 : 2;
}

/**
 * Tailwind transition class for the drawer overlay.
 */
export function getDrawerOverlayTransitionClass(
  transition: keyof DrawerTransition,
): string {
  return get(transitionProps, [transition, "overlay"], "");
}

/**
 * Tailwind transition class for the drawer panel (placement map for `slide`).
 */
export function getDrawerPanelTransitionClass(
  transition: keyof DrawerTransition,
  placement: keyof DrawerPlacement,
): string {
  const panel = get(transitionProps, [transition, "panel"], "");

  if (isString(panel) || isNil(panel)) {
    return panel ?? "";
  }

  return get(panel as DrawerSlidePanel, placement, "");
}

/**
 * Whether the drawer uses enter/leave transition classes.
 */
export function hasDrawerTransition(
  transition: undefined | keyof DrawerTransition,
): boolean {
  return !isNil(transition) && transition !== "none";
}

/**
 * Respects `prefers-reduced-motion`; returns `none` when reduced motion is preferred.
 */
export function resolveEffectiveDrawerTransition(
  transition: keyof DrawerTransition,
): keyof DrawerTransition {
  if (transition === "none") {
    return "none";
  }

  if (!hasWindow()) {
    return transition;
  }

  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return "none";
    }
  } catch {
    // ignore matchMedia errors (older environments)
  }

  return transition;
}
