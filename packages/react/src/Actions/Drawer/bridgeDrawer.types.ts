// ** External Imports
import type { LayerId } from "@bridge-ui/core";
import type { ComponentType, ReactNode } from "react";

// ** Local Imports
import type { DrawerOwnProps } from "@/Components/Drawer/drawer.types";

export type BridgeDrawerShellProps = Partial<
  Omit<DrawerOwnProps, "show" | "stackId">
>;

export type BridgeDrawerHostProps = {
  /**
   * The children to apply to the host.
   */
  children?: ReactNode;

  /**
   * Default shell options merged into every drawer opened via `useDrawerAction()`.
   * Per-call `open({ drawer })` overrides these.
   */
  drawer?: BridgeDrawerShellProps;
};

export type BridgeDrawerEntry = {
  component: ComponentType<Record<string, unknown>>;
  drawer?: BridgeDrawerShellProps;
  id: LayerId;
  onClose?: () => void;
  onClosed?: () => void;
  props?: Record<string, unknown>;
  show: boolean;
};

export type BridgeDrawerOpenOptions<TProps = Record<string, unknown>> = {
  component: ComponentType<TProps>;
  drawer?: BridgeDrawerShellProps;
  onClose?: () => void;
  onClosed?: () => void;
  props?: TProps;
};

export type BridgeDrawerUpdateOptions = {
  drawer?: BridgeDrawerShellProps;
  props?: Record<string, unknown>;
};

export type BridgeDrawerController = {
  close: (id: LayerId) => void;
  closeTop: () => void;
  entries: BridgeDrawerEntry[];
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
