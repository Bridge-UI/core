// ** External Imports
import type { ReactNode } from "react";

// ** Core Imports
import type { FieldOverlayMode } from "@bridge-ui/core/Domain";

// ** Local Imports
import type { DrawerOwnProps } from "@/Components/Drawer/drawer.types";
import type { MenuOwnProps } from "@/Components/Menu/menu.types";
import type { ModalOwnProps } from "@/Components/Modal/modal.types";

export interface FieldOverlayCustomProps {
  /**
   * Props forwarded to the nested `Drawer` when that shell is active.
   *
   * @default undefined
   */
  drawer?: Partial<Omit<DrawerOwnProps, "show" | "children" | "onShowChange">>;

  /**
   * Props forwarded to the nested `Menu` when that shell is active.
   *
   * @default undefined
   */
  menu?: Partial<Omit<MenuOwnProps, "show" | "children" | "onShowChange">>;

  /**
   * Props forwarded to the nested `Modal` when that shell is active.
   *
   * @default undefined
   */
  modal?: Partial<Omit<ModalOwnProps, "show" | "children" | "onShowChange">>;
}

/**
 * Renders field picker / listbox content in a `Menu`, `Modal`, or `Drawer`.
 * Control visibility with `show` and `onShowChange`. Shell-specific options
 * go through `customProps.menu` / `.modal` / `.drawer`.
 */
export interface FieldOverlayOwnProps {
  /**
   * Content rendered inside the active overlay shell.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Extra props for the nested shells (`menu`, `modal`, `drawer`).
   *
   * @default undefined
   */
  customProps?: FieldOverlayCustomProps;

  /**
   * Called when open state should change.
   *
   * @default undefined
   */
  onShowChange?: (show: boolean) => void;

  /**
   * Which overlay shell to use. `auto` uses `menu` on desktop and `drawer`
   * (bottom) on mobile.
   *
   * @default "auto"
   */
  overlay?: FieldOverlayMode;

  /**
   * Whether the overlay is open.
   *
   * @default false
   */
  show?: boolean;
}

export type FieldOverlayProps = FieldOverlayOwnProps;
