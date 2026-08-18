// ** External Imports
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  RefObject,
} from "react";

// ** Core Imports
import type {
  FieldOverlayFooterSlotProps,
  FieldOverlayMode,
  ListboxEntry,
  ListboxOption,
  ListboxValue,
} from "@bridge-ui/core/Domain";
import type { PositionPlacement } from "@bridge-ui/core/Runtime";
import type {
  ListboxColor,
  ListboxRounded,
  ListboxSize,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ButtonOwnProps } from "@/Components/Button";
import type { DrawerOwnProps } from "@/Components/Drawer/drawer.types";
import type { ListOwnProps } from "@/Components/List/list.types";
import type { ListItemOwnProps } from "@/Components/ListItem/listItem.types";
import type { ListSectionOwnProps } from "@/Components/ListSection/listSection.types";
import type { MenuOwnProps } from "@/Components/Menu/menu.types";
import type { ModalOwnProps } from "@/Components/Modal/modal.types";
import type { ProgressOwnProps } from "@/Components/Progress/progress.types";

export interface ListboxSizeOverrides {}
export interface ListboxColorOverrides {}
export interface ListboxRoundedOverrides {}

/**
 * Props accepted by the footer buttons, pinned to the native `button` element.
 */
type ListboxFooterButtonProps = Partial<
  MergeHtmlProps<
    Omit<ButtonOwnProps, "as">,
    ButtonHTMLAttributes<HTMLButtonElement>
  >
>;

export interface ListboxClasses {
  /**
   * Classes merged onto the check icon.
   */
  check?: string;

  /**
   * Classes merged onto the Cancel / Apply footer.
   */
  footer?: string;

  /**
   * Classes forwarded to the loading `Progress` bar.
   */
  loading?: string;

  /**
   * Classes merged onto keyboard-highlighted options.
   */
  optionHighlighted?: string;

  /**
   * Classes merged onto hovered options (pointer).
   */
  optionHover?: string;

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
   * Called when Apply is pressed (`showFooter`).
   */
  onApply?: () => void;

  /**
   * Called when Cancel is pressed (`showFooter`).
   */
  onCancel?: () => void;

  /**
   * Called when composed `ListItem` options register or unregister.
   */
  onRegisteredOptionsChange?: (options: ListboxOption[]) => void;

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
   * Props forwarded to the Apply button.
   *
   * @default undefined
   */
  applyButton?: ListboxFooterButtonProps;

  /**
   * Props forwarded to the Cancel button.
   *
   * @default undefined
   */
  cancelButton?: ListboxFooterButtonProps;

  /**
   * Props forwarded to the nested `Drawer` when `overlay` resolves to `drawer`.
   *
   * @default undefined
   */
  drawer?: Partial<Omit<DrawerOwnProps, "show" | "children" | "onShowChange">>;

  /**
   * Props forwarded to the Cancel / Apply footer.
   *
   * @default undefined
   */
  footer?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the internal `List`.
   *
   * @default undefined
   */
  list?: Partial<Omit<ListOwnProps, "children">>;

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
  listSection?: Partial<Omit<ListSectionOwnProps, "title" | "children">>;

  /**
   * Props forwarded to the floating `Menu` when `overlay` resolves to `menu`.
   * Merged last so they override Listbox defaults.
   *
   * @default undefined
   */
  menu?: Partial<Omit<MenuOwnProps, "show" | "children" | "onShowChange">>;

  /**
   * Props forwarded to the nested `Modal` when `overlay` resolves to `modal`.
   *
   * @default undefined
   */
  modal?: Partial<Omit<ModalOwnProps, "show" | "children" | "onShowChange">>;

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
  scroll?: HTMLAttributes<HTMLDivElement>;
}

export type {
  ListboxEntry,
  ListboxOption,
  ListboxValue,
} from "@bridge-ui/core/Domain";

export interface ListboxOwnProps {
  /**
   * Element that anchors the floating panel (typically the field container).
   */
  anchorEl?: null | HTMLElement | RefObject<null | HTMLElement>;

  /**
   * Composed list content (`ListSection` / `ListItem`). When set, replaces the
   * mapped `options` / `entries` render inside the list.
   */
  children?: ReactNode;

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
   * Extra props for internal parts (`list`, `listItem`, `listSection`, `menu`,
   * `modal`, `drawer`, `progress`, `scroll`, `footer`, `applyButton`,
   * `cancelButton`).
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
   * When `true`, applies the error color palette to options.
   *
   * @default false
   */
  error?: boolean;

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
   * Dialog overlays (`modal` / `drawer`) default to `max-h-[min(60dvh,28rem)]`
   * when unset; menus default to `max-h-60`.
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
   * `entries` is omitted. Ignored for list body when `children` is set.
   *
   * @default []
   */
  options?: ListboxOption[];

  /**
   * Which overlay shell opens the options panel. `auto` uses `menu` on desktop
   * and `drawer` (bottom) on mobile.
   *
   * @default "auto"
   */
  overlay?: FieldOverlayMode;

  /**
   * Preferred placement of the panel relative to the anchor.
   *
   * @default "bottom-start"
   */
  placement?: PositionPlacement;

  /**
   * Roundedness of the panel surface. Applied to `Menu` when the overlay is a
   * menu, and to the Listbox surface when the overlay is a dialog (`modal`
   * uses full corners; `drawer` flushes the bottom edge).
   *
   * When omitted, defaults to `md`.
   *
   * `Select` always forwards its own `rounded` here so the dropdown matches the
   * field, independent of `Menu.defaultProps`.
   */
  rounded?: MergeProps<ListboxRounded, ListboxRoundedOverrides>;

  /**
   * Shows a check icon on selected options.
   *
   * @default true
   */
  showCheckmark?: boolean;

  /**
   * Shows Cancel / Apply footer. When unset, defaults to `true` for dialog
   * shells (`modal` / `drawer`). Parents (e.g. Select) typically keep selection
   * as draft until Apply.
   *
   * @default false (`true` for `modal` / `drawer` when unset)
   */
  showFooter?: boolean;

  /**
   * Typography and option padding scale, aligned with `FormField` / `Select`.
   * Dialog overlays (`modal` / `drawer`) use the `panel` part of the size
   * token (larger padding / type for touch). Menu overlays use `menu`.
   *
   * @default "md"
   */
  size?: MergeProps<ListboxSize, ListboxSizeOverrides>;
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
   * Custom footer. Replaces Cancel / Apply. Call `apply()` to commit and close
   * the overlay, or `cancel()` to discard and close.
   *
   * @default undefined
   */
  footer?: (ctx: FieldOverlayFooterSlotProps) => ReactNode;

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
