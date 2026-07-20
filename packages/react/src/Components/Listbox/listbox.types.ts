// ** External Imports
import type { HTMLAttributes, ReactNode, RefObject } from "react";

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
   * Classes merged onto the indeterminate loading progress bar.
   */
  loading?: string;

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

export interface ListboxCustomProps {
  /**
   * Props forwarded to the floating menu panel.
   */
  content?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the indeterminate loading progress bar.
   */
  loading?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the scrollable options container.
   */
  scroll?: HTMLAttributes<HTMLDivElement>;
}

export type { ListboxOption, ListboxValue } from "@bridge-ui/core";

export interface ListboxOwnProps {
  /**
   * Element that anchors the floating panel (typically the field container).
   */
  anchorEl?: null | HTMLElement | RefObject<null | HTMLElement>;

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
   * When `true`, applies invalidated option colors.
   *
   * @default false
   */
  invalidated?: boolean;

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
   * When `true`, shows an indeterminate progress bar and loading text in the
   * panel (options are hidden while loading).
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Message shown while `loading` is true (ignored when the `loading` slot is set).
   *
   * @default "Loading..."
   */
  loadingMessage?: string;

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
   * Custom loading content. Replaces the default `loadingMessage` when set.
   * The progress bar still renders above this content.
   */
  loading?: ReactNode;

  /**
   * Custom option item content.
   */
  option?: (ctx: { option: ListboxOption; selected: boolean }) => ReactNode;
}

export type ListboxProps = MergeHtmlProps<
  ListboxOwnProps & ListboxControlledProps,
  HTMLAttributes<HTMLDivElement>
>;
