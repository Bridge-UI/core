// ** External Imports
import type { ComputedRef, InjectionKey } from "vue";

// ** Core Imports
import type { ListboxOption, ListboxValue } from "@bridge-ui/core/Domain";
import type { ListboxSizeItem } from "@bridge-ui/core/Tokens/Listbox";

/**
 * Shared listbox state for composed `ListItem` children with `value`.
 */
export type ListboxContextValue = {
  checkClass?: string;
  getOptionIndex: (value: ListboxValue) => number;
  highlightedIndex: number;
  isSelected: (value: ListboxValue) => boolean;
  listboxId?: string;
  mergedClasses: {
    optionHighlighted?: string;
    optionSelected?: string;
  };
  onSelect: (option: ListboxOption) => void;
  optionHighlightedClass?: string;
  optionSelectedClass?: string;
  registerOption: (option: ListboxOption) => () => void;
  showCheckmark: boolean;
  sizeClasses?: ListboxSizeItem;
};

export const LISTBOX_INJECTION_KEY = Symbol("bridge-listbox") as InjectionKey<
  ComputedRef<ListboxContextValue>
>;
