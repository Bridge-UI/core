// ** External Imports
import type {
  AnchorHTMLAttributes,
  Component,
  HTMLAttributes,
  Slot,
  VNode,
} from "vue";

// ** Core Imports
import type { ListboxValue } from "@bridge-ui/core/Domain";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type { IconProps } from "@/Components/Icon";

export interface ListItemClasses {
  /**
   * The classes to apply to the main content column.
   */
  content?: string;

  /**
   * The classes to apply to the trailing slot.
   */
  end?: string;

  /**
   * The classes to apply to the interactive wrapper.
   */
  interactive?: string;

  /**
   * The classes to apply to the primary text.
   */
  primary?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the secondary text.
   */
  secondary?: string;

  /**
   * The classes to apply to the selected icon.
   */
  selectedIcon?: string;

  /**
   * The classes to apply to the leading slot.
   */
  start?: string;
}

export interface ListItemCustomProps {
  /**
   * Props forwarded to the main content column.
   */
  content?: HTMLAttributes;

  /**
   * Props forwarded to the trailing slot wrapper.
   */
  end?: HTMLAttributes;

  /**
   * Props forwarded to the interactive wrapper (`a` when `href` is set).
   */
  interactive?: AnchorHTMLAttributes;

  /**
   * Props forwarded to the primary text.
   */
  primary?: HTMLAttributes;

  /**
   * Props forwarded to the root element.
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the secondary text.
   */
  secondary?: HTMLAttributes;

  /**
   * Props forwarded to the default selected `Icon` (`icon` is set by the item).
   */
  selectedIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the leading slot wrapper.
   */
  start?: HTMLAttributes;
}

/**
 * List row. Set `interactive` for clickable rows, or `href` for a link.
 * Use `role="menuitem"` inside menus or `role="option"` in selects.
 */
export interface ListItemOwnProps {
  /**
   * The element to render as.
   *
   * @default "li"
   */
  as?: "li" | "div";

  /**
   * The classes to apply to the item.
   *
   * @default undefined
   */
  classes?: ListItemClasses;

  /**
   * Props forwarded to each item part.
   *
   * @default undefined
   */
  customProps?: ListItemCustomProps;

  /**
   * Compact vertical padding. Inherits `dense` from parent `List` when omitted.
   *
   * @default undefined
   */
  dense?: boolean;

  /**
   * When true, the item is not interactive and appears muted.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * When true, renders a bottom divider on the item.
   *
   * @default false
   */
  divider?: boolean;

  /**
   * URL for the interactive wrapper. Renders an anchor so hover shows the
   * address and middle-click opens a new tab.
   *
   * @default undefined
   */
  href?: string;

  /**
   * When true, applies hover/focus styles and `tabIndex={0}` on the inner wrapper.
   * Implied when `href` is set.
   *
   * @default false
   */
  interactive?: boolean;

  /**
   * Component rendered in place of the interactive `<a>`.
   * The root stays `as` (`li` or `div`). Ignored while disabled.
   *
   * @default undefined
   */
  linkAs?: string | Component;

  /**
   * Primary label text.
   *
   * @default undefined
   */
  primary?: string;

  /**
   * Relationship of the linked URL. Forwarded to the anchor when `href` is set.
   *
   * @default undefined
   */
  rel?: string;

  /**
   * ARIA role for the interactive wrapper. Omitted when `href` is set.
   *
   * @default "button"
   */
  role?: "button" | "option" | "menuitem";

  /**
   * Secondary/description text below the primary line.
   *
   * @default undefined
   */
  secondary?: string;

  /**
   * When true, highlights the item as selected.
   *
   * @default false
   */
  selected?: boolean;

  /**
   * The icon shown when `selected` is true. Use `null` to hide it.
   * The `end` slot replaces this icon when provided.
   *
   * @default Check
   */
  selectedIcon?: null | IconSource;

  /**
   * Where to open the URL. Forwarded to the anchor when `href` is set.
   *
   * @default undefined
   */
  target?: string;

  /**
   * When set inside a `Listbox`, registers this row as a selectable option.
   *
   * @default undefined
   */
  value?: ListboxValue;
}

export type ListItemPrimaryContent = VNode | string | VNode[] | undefined;

export interface ListItemSlots {
  /**
   * Default slot — used as primary content when `primary` is not set.
   */
  default?: Slot<undefined>;

  /**
   * Trailing content.
   */
  end?: Slot<undefined>;

  /**
   * Primary label markup.
   */
  primary?: Slot<undefined>;

  /**
   * Secondary/description markup.
   */
  secondary?: Slot<undefined>;

  /**
   * Leading content.
   */
  start?: Slot<undefined>;
}

export type ListItemProps = MergeHtmlProps<ListItemOwnProps, HTMLAttributes>;
