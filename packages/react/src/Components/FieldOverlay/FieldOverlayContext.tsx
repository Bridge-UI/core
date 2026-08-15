// ** External Imports
import { createContext, useContext } from "react";

/**
 * Footer Apply / Cancel actions for the nearest {@link FieldOverlay}.
 */
export type FieldOverlayFooterContextValue = {
  /**
   * Closes the overlay after Apply.
   */
  apply: () => void;

  /**
   * Closes the overlay after Cancel.
   */
  cancel: () => void;
};

export const FieldOverlayContext =
  createContext<null | FieldOverlayFooterContextValue>(null);

/**
 * Footer close helpers from the nearest FieldOverlay, or no-ops when none.
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
