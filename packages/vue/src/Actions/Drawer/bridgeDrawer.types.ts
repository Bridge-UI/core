// ** External Imports
import type { LayerId } from "@bridge-ui/core";
import type { Component, Ref } from "vue";

// ** Local Imports
import type { DrawerOwnProps } from "@/Components/Drawer/drawer.types";

export type BridgeDrawerShellProps = Partial<Omit<DrawerOwnProps, "stackId">>;

export type BridgeDrawerHostProps = {
  /**
   * Default shell options merged into every drawer opened via `useDrawerAction()`.
   * Per-call `open({ drawer })` overrides these.
   */
  drawer?: BridgeDrawerShellProps;
};

export type BridgeDrawerEntry = {
  component: Component;
  drawer?: Partial<DrawerOwnProps>;
  id: LayerId;
  onClose?: () => void;
  onClosed?: () => void;
  props?: Record<string, unknown>;
  show: boolean;
};

export type BridgeDrawerOpenOptions<TProps = Record<string, unknown>> = {
  component: Component;
  drawer?: Partial<DrawerOwnProps>;
  onClose?: () => void;
  onClosed?: () => void;
  props?: TProps;
};

export type BridgeDrawerUpdateOptions = {
  drawer?: Partial<DrawerOwnProps>;
  props?: Record<string, unknown>;
};

export type BridgeDrawerController = {
  close: (id: LayerId) => void;
  closeTop: () => void;
  entries: Ref<BridgeDrawerEntry[]>;
  isOpen: (id: LayerId) => boolean;
  open: <TProps = Record<string, unknown>>(
    options: BridgeDrawerOpenOptions<TProps>,
  ) => LayerId;
  removeEntry: (id: LayerId) => void;
  syncShow: (id: LayerId, show: boolean) => void;
  update: (id: LayerId, options: BridgeDrawerUpdateOptions) => void;
};

export type BridgeDrawerApi = Omit<
  BridgeDrawerController,
  "entries" | "syncShow" | "removeEntry"
> & {
  stackSize: number;
};
