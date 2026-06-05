// ** Local Imports
import type { SnackbarPosition } from "@core/Components/Snackbar/Position";
import {
  transitionProps,
  type SnackbarTransition,
} from "@core/Components/Snackbar/Transition";

/**
 * Flex direction for the imperative snackbar stack (`useBridgeSnackbar` host).
 *
 * - `top-*`: oldest at the top, each `open()` appends below (grows downward).
 * - `bottom-*`: oldest near the viewport edge, each `open()` stacks upward.
 */
export function getSnackbarStackClass(
  position: keyof SnackbarPosition,
): string {
  return position.startsWith("top") ? "flex-col" : "flex-col-reverse";
}

export function getSnackbarTransitionClass(
  transition: keyof SnackbarTransition,
): string {
  return transitionProps[transition] ?? "";
}

export function hasSnackbarTransition(
  transition: keyof SnackbarTransition | undefined,
): boolean {
  return transition !== undefined && transition !== "none";
}
