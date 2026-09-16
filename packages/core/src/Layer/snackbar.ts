// ** External Imports
import { isNil } from "es-toolkit/compat";

// ** Local Imports
import { hasWindow } from "@/Runtime/env";
import type { SnackbarPadding } from "@/Tokens/Snackbar/Padding";
import {
  transitionProps,
  type SnackbarTransition,
} from "@/Tokens/Snackbar/Transition";

/**
 * Fallback ms to finish leave when `transitionend` never fires.
 * Matches `duration-300` snackbar transitions with a small buffer.
 */
export const SNACKBAR_LEAVE_FALLBACK_MS = 350;

/**
 * Gets the transition class for a snackbar.
 */
export function getSnackbarTransitionClass(
  transition: keyof SnackbarTransition,
): string {
  return transitionProps[transition] ?? "";
}

/**
 * Checks if a snackbar has a transition.
 */
export function hasSnackbarTransition(
  transition: undefined | keyof SnackbarTransition,
): boolean {
  return !isNil(transition) && transition !== "none";
}

/**
 * Respects `prefers-reduced-motion`; returns `none` when reduced motion is preferred.
 */
export function resolveEffectiveSnackbarTransition(
  transition: keyof SnackbarTransition,
): keyof SnackbarTransition {
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

/**
 * `small` padding places a single accept action in the trailing slot (former `dense` layout).
 */
export function usesTrailingSnackbarActions(
  padding: undefined | keyof SnackbarPadding,
): boolean {
  return padding === "small";
}
