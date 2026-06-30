// ** External Imports
import { isNil } from "es-toolkit/compat";

// ** Local Imports
import type { SnackbarPadding } from "@/Components/Snackbar/Padding";
import {
  transitionProps,
  type SnackbarTransition,
} from "@/Components/Snackbar/Transition";

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
 * `small` padding places a single accept action in the trailing slot (former `dense` layout).
 */
export function usesTrailingSnackbarActions(
  padding: undefined | keyof SnackbarPadding,
): boolean {
  return padding === "small";
}
