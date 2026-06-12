// ** External Imports
import type { HTMLAttributes, ReactNode, RefObject } from "react";

// ** Core Imports
import type {
  ListboxColor,
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
}

export interface ListboxPartsProps {
  /**
   * Props forwarded to the floating menu panel.
   */
  content?: HTMLAttributes<HTMLDivElement>;
}

export type ListboxValue = string | number;

export interface ListboxOption {
  /**
   * Secondary line below the label.
   */
  description?: string;

  /**
   * Whether the option is disabled.
   */
  disabled?: boolean;

  /**
   * The label of the option.
   */
  label: string;

  /**
   * Original data when mapped from arbitrary objects.
   */
  raw?: unknown;

  /**
   * The value of the option.
   */
  value: ListboxValue;
}

export interface ListboxOwnProps {
  /**
   * Element that anchors the floating panel (typically the field container).
   */
  anchorEl?: HTMLElement | RefObject<HTMLElement | null> | null;

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
   * When true, the menu does not auto-focus the first item on open.
   * Use when focus stays on a combobox input (e.g. searchable Select).
   *
   * @default false
   */
  disableAutoFocus?: boolean;

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
   * Extra props for internal parts.
   */
  partsProps?: ListboxPartsProps;

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
  afterOptions?: ReactNode;

  /**
   * Content above the list.
   */
  beforeOptions?: ReactNode;

  /**
   * Custom empty-state content.
   */
  empty?: ReactNode;

  /**
   * Custom loading content.
   */
  loading?: ReactNode;

  /**
   * Custom option item content.
   */
  option?: (ctx: { option: ListboxOption; selected: boolean }) => ReactNode;
}

export interface ListboxControlledProps {
  /**
   * Emitted when the user activates an option.
   */
  onSelect?: (option: ListboxOption) => void;

  /**
   * Called when open state should change.
   */
  onShowChange?: (show: boolean) => void;

  /**
   * Whether the panel is open.
   */
  show?: boolean;

  /**
   * Named slots for listbox regions.
   */
  slots?: ListboxSlots;
}

export type ListboxProps = MergeHtmlProps<
  ListboxOwnProps & ListboxControlledProps,
  HTMLAttributes<HTMLDivElement>
>;
