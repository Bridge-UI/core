// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  ListboxColor,
  ListboxOption,
  ListboxValue,
  MergeHtmlProps,
  MergeProps,
  PositionPlacement,
} from "@bridge-ui/core";

export interface ListboxColorOverrides {}

export interface ListboxClasses {
  /**
   * Classes merged onto the check icon.
   */
  check?: string;

  /**
   * Classes merged onto keyboard-highlighted options.
   */
  optionHighlighted?: string;

  /**
   * Classes merged onto selected options.
   */
  optionSelected?: string;

  /**
   * Classes merged onto the scrollable options container.
   */
  scroll?: string;
}

export interface ListboxCustomProps {
  /**
   * Props forwarded to the floating menu panel.
   */
  content?: HTMLAttributes;

  /**
   * Props forwarded to the scrollable options container.
   */
  scroll?: HTMLAttributes;
}

export type { ListboxOption, ListboxValue } from "@bridge-ui/core";

export interface ListboxEmits {
  /**
   * Emitted when the user activates an option.
   */
  select: [option: ListboxOption];

  /**
   * Emitted when open state should change (controlled state).
   * Listen with `@show-change` / `v-on:show-change`.
   */
  "show-change": [show: boolean];
}

export interface ListboxOwnProps {
  /**
   * Element that anchors the floating panel (typically the field container).
   */
  anchorEl?: HTMLElement | null;

  /**
   * Classes for listbox parts.
   */
  classes?: ListboxClasses;

  /**
   * Color palette aligned with `FormField` (`primary`, `error`, …).
   *
   * @default "primary"
   */
  color?: MergeProps<ListboxColor, ListboxColorOverrides>;

  /**
   * Extra props for internal parts.
   */
  customProps?: ListboxCustomProps;

  /**
   * When true, the menu does not auto-focus the first item on open.
   * Use when focus stays on a combobox input (e.g. searchable Select).
   *
   * @default false
   */
  disableAutoFocus?: boolean;

  /**
   * When true, the options list is not height-limited.
   *
   * @default false
   */
  disableMaxHeight?: boolean;

  /**
   * Message when the options list is empty.
   *
   * @default "No options"
   */
  emptyMessage?: string;

  /**
   * Hides the empty-state message.
   *
   * @default false
   */
  hideEmptyMessage?: boolean;

  /**
   * Index of the keyboard-highlighted option.
   *
   * @default -1
   */
  highlightedIndex?: number;

  /**
   * Whether a value is selected (shows checkmark when `showCheckmark` is true).
   */
  isSelected?: (value: ListboxValue) => boolean;

  /**
   * `id` of the element that labels the listbox (`aria-labelledby`).
   */
  labelledBy?: string;

  /**
   * Root id of the listbox (`aria-controls` on the combobox references this).
   */
  listboxId: string;

  /**
   * External loading state.
   */
  loading?: boolean;

  /**
   * Tailwind max-height class for the options scroll area (e.g. `max-h-80`).
   *
   * @default "max-h-60"
   */
  maxHeight?: string;

  /**
   * Whether multiple options can be selected.
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Options to render.
   */
  options: ListboxOption[];

  /**
   * Preferred placement of the panel relative to the anchor.
   *
   * @default "bottom-start"
   */
  placement?: PositionPlacement;

  /**
   * Shows a check icon on selected options.
   *
   * @default true
   */
  showCheckmark?: boolean;
}

export interface ListboxSlots {
  /**
   * Content below the list.
   */
  afterOptions?: Slot;

  /**
   * Content above the list.
   */
  beforeOptions?: Slot;

  /**
   * Custom empty-state content.
   */
  empty?: Slot;

  /**
   * Custom loading content.
   */
  loading?: Slot;

  /**
   * Custom option item content.
   */
  option?: Slot<{ option: ListboxOption; selected: boolean }>;
}

export type ListboxProps = MergeHtmlProps<ListboxOwnProps, HTMLAttributes>;
