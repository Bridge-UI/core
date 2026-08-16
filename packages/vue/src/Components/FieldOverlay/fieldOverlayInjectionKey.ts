// ** External Imports
import type { InjectionKey } from "vue";

/**
 * Footer Apply / Cancel actions for the nearest FieldOverlay.
 * These only close the overlay. Picker and listbox `footer` slot
 * `apply` / `cancel` commit or discard first, then call these.
 */
export type FieldOverlayFooterApi = {
  /**
   * Closes the overlay. Call after committing draft state.
   */
  apply: () => void;

  /**
   * Closes the overlay. Call after discarding draft state.
   */
  cancel: () => void;
};

export const FIELD_OVERLAY_INJECTION_KEY: InjectionKey<FieldOverlayFooterApi> =
  Symbol("bridge-field-overlay");
