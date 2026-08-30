// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  SidebarCollapsible,
  SidebarSide,
  SidebarVariant,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

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
  content?: HTMLAttributes;

  /**
   * Props forwarded to the footer.
   */
  footer?: HTMLAttributes;

  /**
   * Props forwarded to the in-flow gap spacer.
   */
  gap?: HTMLAttributes;

  /**
   * Props forwarded to the header.
   */
  header?: HTMLAttributes;

  /**
   * Props forwarded to the inner panel surface.
   */
  panel?: HTMLAttributes;

  /**
   * Props forwarded to the desktop rail chrome.
   */
  root?: HTMLAttributes;
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
  root?: HTMLAttributes;
}

export interface SidebarInsetOwnProps {
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

export interface SidebarInsetSlots {
  /**
   * Main content.
   */
  default?: Slot;
}

/**
 * Persistent app-shell sidebar panel. Mount under `SidebarProvider` with
 * `SidebarInset`. Put `List` / `Accordion` in the default slot.
 */
export interface SidebarOwnProps {
  /**
   * Accessible name for the desktop `aside` and the mobile drawer.
   *
   * @default "Sidebar"
   */
  ariaLabel?: string;

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
   * Visual layout of the rail and inset.
   *
   * @default "sidebar"
   */
  variant?: MergeProps<SidebarVariant, SidebarVariantOverrides>;
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
  root?: HTMLAttributes;
}

export interface SidebarProviderEmits {
  /**
   * Emitted when the desktop `open` state should change.
   */
  openChange: [open: boolean];

  /**
   * Emitted when `v-model` should update.
   */
  "update:modelValue": [open: boolean];
}

export interface SidebarProviderOwnProps {
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
   * Initial desktop expanded state when `v-model` is omitted.
   *
   * @default true
   */
  defaultOpen?: boolean;
}

export interface SidebarProviderSlots {
  /**
   * App shell (`Sidebar`, `SidebarInset`, …).
   */
  default?: Slot;
}

export interface SidebarSlots {
  /**
   * Scrollable rail (`List`, `Accordion`, …).
   */
  default?: Slot;

  /**
   * Sticky footer (user menu, settings).
   */
  footer?: Slot;

  /**
   * Sticky header (branding, workspace switcher).
   */
  header?: Slot;
}

export interface SidebarTriggerOwnProps {}

export interface SidebarTriggerSlots {
  /**
   * Replaces the default toggle icon.
   */
  default?: Slot;
}

export type SidebarInsetProps = MergeHtmlProps<
  SidebarInsetOwnProps,
  HTMLAttributes
>;

export type SidebarProps = MergeHtmlProps<SidebarOwnProps, HTMLAttributes>;

export type SidebarProviderProps = MergeHtmlProps<
  SidebarProviderOwnProps,
  HTMLAttributes
>;

export type SidebarTriggerProps = MergeHtmlProps<
  SidebarTriggerOwnProps,
  ButtonHTMLAttributes
>;
