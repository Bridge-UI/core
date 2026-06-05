// ** Local Imports
import {
  transitionProps,
  type SnackbarTransition,
} from "@core/Components/Snackbar/Transition";

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
