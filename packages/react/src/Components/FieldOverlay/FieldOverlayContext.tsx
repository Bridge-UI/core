// ** External Imports
import { createContext, useContext } from "react";

/**
 * Footer Apply / Cancel actions for the nearest {@link FieldOverlay}.
 * These only close the overlay. Picker and listbox `footer` slot
 * `apply` / `cancel` commit or discard first, then call these.
 */
export type FieldOverlayFooterContextValue = {
  /**
   * Closes the overlay. Call after committing draft state.
   */
  apply: () => void;

  /**
   * Closes the overlay. Call after discarding draft state.
   */
  cancel: () => void;
};

export const FieldOverlayContext =
  createContext<null | FieldOverlayFooterContextValue>(null);

/**
 * Footer close helpers from the nearest FieldOverlay, or no-ops when none.
 * Use the picker / listbox `footer` slot `apply` / `cancel` in app code —
 * those commit or discard, then close. This hook only closes.
 */
export function useFieldOverlayFooter(): FieldOverlayFooterContextValue {
  const context = useContext(FieldOverlayContext);

  return {
    apply: () => {
      context?.apply();
    },
    cancel: () => {
      context?.cancel();
    },
  };
}
