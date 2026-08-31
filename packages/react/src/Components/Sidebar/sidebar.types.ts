// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { PositionPlacement } from "@bridge-ui/core/Runtime";
import type {
  SidebarCollapsible,
  SidebarSide,
  SidebarVariant,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ListProps } from "@/Components/List/list.types";
import type { ListItemProps } from "@/Components/ListItem/listItem.types";

export interface SidebarSideOverrides {}
export interface SidebarVariantOverrides {}
export interface SidebarCollapsibleOverrides {}

export interface SidebarClasses {
  /**
   * The classes to apply to the scrollable content region.
   */
  content?: string;

  /**
   * The classes to apply to the footer.
   */
  footer?: string;

  /**
   * The classes to apply to the in-flow gap spacer.
   */
  gap?: string;

  /**
   * The classes to apply to the header.
   */
  header?: string;

  /**
   * The classes to apply to the inner panel surface.
   */
  panel?: string;

  /**
   * The classes to apply to the desktop rail chrome (gap + fixed panel).
   */
  root?: string;
}

export interface SidebarCustomProps {
  /**
   * Props forwarded to the scrollable content region.
   */
  content?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the footer.
   */
  footer?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the in-flow gap spacer.
   */
  gap?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the header.
   */
  header?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the inner panel surface.
   */
  panel?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the desktop rail chrome.
   */
  root?: HTMLAttributes<HTMLDivElement>;
}

export interface SidebarInsetClasses {
  /**
   * The classes to apply to the inset root.
   */
  root?: string;
}

export interface SidebarInsetCustomProps {
  /**
   * Props forwarded to the inset root.
   */
  root?: HTMLAttributes<HTMLElement>;
}

export interface SidebarInsetOwnProps {
  /**
   * The children to render.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * The classes to apply to the inset.
   *
   * @default undefined
   */
  classes?: SidebarInsetClasses;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: SidebarInsetCustomProps;
}

export interface SidebarListItemOwnProps {
  /**
   * Tooltip label for the whole hit target. When omitted, string `primary`
   * is used while the icon rail is collapsed.
   *
   * @default undefined
   */
  tooltip?: string;

  /**
   * Placement of {@link SidebarListItemOwnProps.tooltip}. Defaults to the
   * side opposite the rail.
   *
   * @default undefined
   */
  tooltipPlacement?: PositionPlacement;
}

/**
 * Persistent app-shell sidebar panel. Mount under `SidebarProvider` with
 * `SidebarInset`. Put `SidebarList` / `Accordion` in `children`.
 */
export interface SidebarOwnProps {
  /**
   * Accessible name for the desktop `aside` and the mobile drawer.
   *
   * @default "Sidebar"
   */
  ariaLabel?: string;

  /**
   * The children to render in the scrollable region.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * The classes to apply to the sidebar.
   *
   * @default undefined
   */
  classes?: SidebarClasses;

  /**
   * How the desktop rail hides.
   *
   * @default "offcanvas"
   */
  collapsible?: MergeProps<SidebarCollapsible, SidebarCollapsibleOverrides>;

  /**
   * Extra props for internal parts (`header`, `content`, `footer`, etc.).
   * Root HTML attributes stay on the component top level.
   *
   * @default undefined
   */
  customProps?: SidebarCustomProps;

  /**
   * Which edge the rail docks to.
   *
   * @default "left"
   */
  side?: MergeProps<SidebarSide, SidebarSideOverrides>;

  /**
   * Header and footer slots. `children` is the scroller.
   *
   * @default undefined
   */
  slots?: SidebarSlots;

  /**
   * Visual layout of the rail and inset.
   *
   * @default "sidebar"
   */
  variant?: MergeProps<SidebarVariant, SidebarVariantOverrides>;
}

export interface SidebarProviderCallbacks {
  /**
   * Called when the desktop `open` state should change (controlled).
   *
   * @default undefined
   */
  onOpenChange?: (open: boolean) => void;
}

export interface SidebarProviderClasses {
  /**
   * The classes to apply to the layout wrapper.
   */
  root?: string;
}

export interface SidebarProviderCustomProps {
  /**
   * Props forwarded to the layout wrapper.
   */
  root?: HTMLAttributes<HTMLDivElement>;
}

export interface SidebarProviderOwnProps {
  /**
   * The children to render (`Sidebar`, `SidebarInset`, etc.).
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * The classes to apply to the provider wrapper.
   *
   * @default undefined
   */
  classes?: SidebarProviderClasses;

  /**
   * Extra props for the layout wrapper.
   *
   * @default undefined
   */
  customProps?: SidebarProviderCustomProps;

  /**
   * Initial desktop expanded state when `open` is omitted.
   *
   * @default true
   */
  defaultOpen?: boolean;

  /**
   * Controlled desktop expanded state.
   *
   * @default undefined
   */
  open?: boolean;
}

export interface SidebarSlots {
  /**
   * Sticky footer (user menu, settings).
   */
  footer?: ReactNode;

  /**
   * Sticky header (branding, workspace switcher).
   */
  header?: ReactNode;
}

export interface SidebarTriggerOwnProps {
  /**
   * The children to render inside the trigger. Replaces the default icon.
   *
   * @default undefined
   */
  children?: ReactNode;
}

export type SidebarInsetProps = MergeHtmlProps<
  SidebarInsetOwnProps,
  HTMLAttributes<HTMLElement>
>;

export type SidebarProps = MergeHtmlProps<
  SidebarOwnProps,
  HTMLAttributes<HTMLDivElement>
>;

export type SidebarProviderProps = MergeHtmlProps<
  SidebarProviderOwnProps & SidebarProviderCallbacks,
  HTMLAttributes<HTMLDivElement>
>;

export type SidebarTriggerProps = MergeHtmlProps<
  SidebarTriggerOwnProps,
  ButtonHTMLAttributes<HTMLButtonElement>
>;

/**
 * `List` bound to the nearest `Sidebar`. Sets `iconOnly` when the icon rail
 * is collapsed on desktop.
 */
export type SidebarListProps = ListProps;

/**
 * `ListItem` bound to the nearest `Sidebar`. Shows `primary` in a tooltip
 * when the icon rail is collapsed.
 */
export type SidebarListItemProps = ListItemProps & SidebarListItemOwnProps;
