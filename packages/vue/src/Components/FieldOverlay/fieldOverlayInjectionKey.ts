// ** External Imports
import type { InjectionKey } from "vue";

/**
 * Footer Apply / Cancel actions for the nearest FieldOverlay.
 */
export type FieldOverlayFooterApi = {
  /**
   * Closes the overlay after Apply.
   */
  apply: () => void;

  /**
   * Closes the overlay after Cancel.
   */
  cancel: () => void;
};

export const FIELD_OVERLAY_INJECTION_KEY: InjectionKey<FieldOverlayFooterApi> =
  Symbol("bridge-field-overlay");
