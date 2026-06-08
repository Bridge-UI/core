// ** External Imports
import type { LayerId } from "@bridge-ui/core";
import type { ComponentType, ReactNode } from "react";

// ** Local Imports
import type { ModalOwnProps } from "@/Components/Modal/modal.types";

export type BridgeModalShellProps = Partial<
  Omit<ModalOwnProps, "show" | "stackId">
>;

export type BridgeModalHostProps = {
  /**
   * The children to apply to the host.
   */
  children?: ReactNode;

  /**
   * Default shell options merged into every modal opened via `useModalAction()`.
   * Per-call `open({ modal })` overrides these.
   */
  modal?: BridgeModalShellProps;
};

export type BridgeModalEntry = {
  component: ComponentType<Record<string, unknown>>;
  id: LayerId;
  modal?: BridgeModalShellProps;
  onClose?: () => void;
  onClosed?: () => void;
  props?: Record<string, unknown>;
  show: boolean;
};

export type BridgeModalOpenOptions<TProps = Record<string, unknown>> = {
  component: ComponentType<TProps>;
  modal?: BridgeModalShellProps;
  onClose?: () => void;
  onClosed?: () => void;
  props?: TProps;
};

export type BridgeModalUpdateOptions = {
  modal?: BridgeModalShellProps;
  props?: Record<string, unknown>;
};

export type BridgeModalController = {
  close: (id: LayerId) => void;
  closeTop: () => void;
  entries: BridgeModalEntry[];
  isOpen: (id: LayerId) => boolean;
  open: <TProps = Record<string, unknown>>(
    options: BridgeModalOpenOptions<TProps>,
  ) => LayerId;
  removeEntry: (id: LayerId) => void;
  syncShow: (id: LayerId, show: boolean) => void;
  update: (id: LayerId, options: BridgeModalUpdateOptions) => void;
};

export type BridgeModalApi = Omit<
  BridgeModalController,
  "entries" | "syncShow" | "removeEntry"
> & {
  stackSize: number;
};
