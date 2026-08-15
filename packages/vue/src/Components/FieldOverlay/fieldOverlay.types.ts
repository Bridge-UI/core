// ** External Imports
import type { Slot } from "vue";

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
  drawer?: Partial<DrawerOwnProps>;

  /**
   * Props forwarded to the nested `Menu` when that shell is active.
   *
   * @default undefined
   */
  menu?: Partial<MenuOwnProps>;

  /**
   * Props forwarded to the nested `Modal` when that shell is active.
   *
   * @default undefined
   */
  modal?: Partial<ModalOwnProps>;
}

export interface FieldOverlayEmits {
  /**
   * Emitted when the user dismisses the overlay.
   */
  close: [];

  /**
   * Emitted when open state should change.
   * Listen with `@show-change` / `v-on:show-change`.
   */
  "show-change": [show: boolean];
}

/**
 * Renders field picker / listbox content in a `Menu`, `Modal`, or `Drawer`.
 * Visibility is controlled with `v-model`. Shell-specific options go through
 * `customProps.menu` / `.modal` / `.drawer`.
 */
export interface FieldOverlayOwnProps {
  /**
   * Extra props for the nested shells (`menu`, `modal`, `drawer`).
   *
   * @default undefined
   */
  customProps?: FieldOverlayCustomProps;

  /**
   * Which overlay shell to use. `auto` uses `menu` on desktop and `drawer`
   * (bottom) on mobile.
   *
   * @default "auto"
   */
  overlay?: FieldOverlayMode;
}

export interface FieldOverlaySlots {
  /**
   * Content rendered inside the active overlay shell.
   */
  default?: Slot;
}

export type FieldOverlayProps = FieldOverlayOwnProps;
