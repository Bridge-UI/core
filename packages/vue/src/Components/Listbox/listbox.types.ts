// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  ListboxColor,
  ListboxEntry,
  ListboxOption,
  ListboxSize,
  ListboxValue,
  MenuRounded,
  MergeHtmlProps,
  MergeProps,
  PositionPlacement,
} from "@bridge-ui/core";

// ** Local Imports
import type { ListOwnProps } from "@/Components/List/list.types";
import type { ListItemOwnProps } from "@/Components/ListItem/listItem.types";
import type { ListSectionOwnProps } from "@/Components/ListSection/listSection.types";
import type { MenuOwnProps } from "@/Components/Menu/menu.types";
import type { ProgressOwnProps } from "@/Components/Progress/progress.types";

export interface ListboxSizeOverrides {}
export interface ListboxColorOverrides {}
export interface ListboxRoundedOverrides {}

export interface ListboxClasses {
  /**
   * Classes merged onto the check icon.
   */
  check?: string;

  /**
   * Classes forwarded to the loading `Progress` bar.
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

export interface ListboxCustomProps {
  /**
   * Props forwarded to the internal `List`.
   *
   * @default undefined
   */
  list?: Partial<ListOwnProps>;

  /**
   * Props forwarded to each mapped `ListItem` option.
   * Merged last so they override Listbox defaults.
   *
   * @default undefined
   */
  listItem?: Partial<ListItemOwnProps>;

  /**
   * Props forwarded to each mapped `ListSection`.
   *
   * @default undefined
   */
  listSection?: Partial<Omit<ListSectionOwnProps, "title">>;

  /**
   * Props forwarded to the floating `Menu`.
   * Merged last so they override Listbox defaults.
   *
   * @default undefined
   */
  menu?: Partial<MenuOwnProps>;

  /**
   * Props forwarded to the loading `Progress`.
   *
   * @default undefined
   */
  progress?: Partial<ProgressOwnProps>;

  /**
   * Props forwarded to the scrollable options container.
   *
   * @default undefined
   */
  scroll?: HTMLAttributes;
}

export type {
  ListboxEntry,
  ListboxOption,
  ListboxValue,
} from "@bridge-ui/core";

export interface ListboxEmits {
  /**
   * Emitted when composed `ListItem` options register or unregister.
   */
  "registered-options-change": [options: ListboxOption[]];

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
  anchorEl?: null | HTMLElement;

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
   * Public parent registry key for nested `tokens.listbox`.
   *
   * @internal
   */
  componentName?: "Select" | "Autocomplete";

  /**
   * Extra props for internal parts (`list`, `listItem`, `listSection`, `menu`,
   * `progress`, `scroll`).
   *
   * @default undefined
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
   * Structured entries (sections + options). When set, preferred over a flat
   * `options` map for rendering section headers.
   */
  entries?: ListboxEntry[];

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
   * Options to render. Used for empty-state and as a flat fallback when
   * `entries` is omitted. Ignored for list body when the default slot is set.
   *
   * @default []
   */
  options?: ListboxOption[];

  /**
   * Preferred placement of the panel relative to the anchor.
   *
   * @default "bottom-start"
   */
  placement?: PositionPlacement;

  /**
   * Roundedness of the floating panel (`Menu`). When omitted, `Menu` defaults
   * apply (including `Menu.defaultProps.rounded`).
   *
   * `Select` always forwards its own `rounded` here so the dropdown matches the
   * field, independent of `Menu.defaultProps`.
   */
  rounded?: MergeProps<MenuRounded, ListboxRoundedOverrides>;

  /**
   * Shows a check icon on selected options.
   *
   * @default true
   */
  showCheckmark?: boolean;

  /**
   * Typography and option padding scale, aligned with `FormField` / `Select`.
   *
   * @default "md"
   */
  size?: MergeProps<ListboxSize, ListboxSizeOverrides>;
}

export interface ListboxSlots {
  /**
   * Content below the list.
   */
  afterOptions?: Slot<undefined>;

  /**
   * Content above the list.
   */
  beforeOptions?: Slot<undefined>;

  /**
   * Composed list content (`ListSection` / `ListItem`). When set, replaces the
   * mapped `options` / `entries` render inside the list.
   */
  default?: Slot<undefined>;

  /**
   * Custom empty-state content.
   */
  empty?: Slot<undefined>;

  /**
   * Custom loading content. Replaces the default `loadingMessage` when set.
   * The progress bar still renders above this content.
   */
  loading?: Slot<undefined>;

  /**
   * Custom option item content.
   */
  option?: Slot<{ option: ListboxOption; selected: boolean }>;
}

export type ListboxProps = MergeHtmlProps<ListboxOwnProps, HTMLAttributes>;
