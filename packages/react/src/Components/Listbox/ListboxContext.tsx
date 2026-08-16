// ** External Imports
import { createContext, useContext } from "react";

// ** Core Imports
import type { ListboxOption, ListboxValue } from "@bridge-ui/core/Domain";
import type { ListboxSizeOverlayItem } from "@bridge-ui/core/Tokens";

/**
 * Shared listbox state for composed `ListItem` children with `value`.
 */
export type ListboxContextValue = {
  /**
   * Classes for the selected-option check icon.
   */
  checkClass?: string;

  /**
   * Returns the flat option index for `value`, or `-1` when unknown.
   */
  getOptionIndex: (value: ListboxValue) => number;

  /**
   * Keyboard-highlighted flat option index.
   */
  highlightedIndex: number;

  /**
   * Whether `value` is currently selected.
   */
  isSelected: (value: ListboxValue) => boolean;

  /**
   * DOM id prefix for option elements.
   */
  listboxId?: string;

  /**
   * Registry classes for selected / highlighted / hovered options.
   */
  mergedClasses: {
    optionHighlighted?: string;
    optionHover?: string;
    optionSelected?: string;
  };

  /**
   * Called when a composed option is activated.
   */
  onSelect: (option: ListboxOption) => void;

  /**
   * Classes for keyboard-highlighted options.
   */
  optionHighlightedClass?: string;

  /**
   * Classes for pointer-hovered options.
   */
  optionHoverClass?: string;

  /**
   * Classes for selected options.
   */
  optionSelectedClass?: string;

  /**
   * Registers a composed option; returns an unregister function.
   */
  registerOption: (option: ListboxOption) => () => void;

  /**
   * Whether to show a check icon on selected composed options.
   */
  showCheckmark: boolean;

  /**
   * Size token classes for option / primary / secondary / check.
   */
  sizeClasses?: ListboxSizeOverlayItem;
};

export const ListboxContext = createContext<null | ListboxContextValue>(null);

export function useListboxContext() {
  return useContext(ListboxContext);
}
