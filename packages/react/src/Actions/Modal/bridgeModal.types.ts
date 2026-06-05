// ** External Imports
import type { LayerId } from "@bridge-ui/core";
import type { ComponentType } from "react";

// ** Local Imports
import type { ModalOwnProps } from "@/Components/Modal/modal.types";

export type BridgeModalShellProps = Partial<
  Omit<ModalOwnProps, "show" | "stackId">
>;

export type BridgeModalEntry = {
  id: LayerId;
  show: boolean;
  onClose?: () => void;
  onClosed?: () => void;
  modal?: Partial<ModalOwnProps>;
  props?: Record<string, unknown>;
  component: ComponentType<Record<string, unknown>>;
};

export type BridgeModalOpenOptions<TProps = Record<string, unknown>> = {
  props?: TProps;
  onClose?: () => void;
  onClosed?: () => void;
  modal?: Partial<ModalOwnProps>;
  component: ComponentType<TProps>;
};

export type BridgeModalUpdateOptions = {
  modal?: Partial<ModalOwnProps>;
  props?: Record<string, unknown>;
};

export type BridgeModalController = {
  closeTop: () => void;
  entries: BridgeModalEntry[];
  close: (id: LayerId) => void;
  isOpen: (id: LayerId) => boolean;
  removeEntry: (id: LayerId) => void;
  syncShow: (id: LayerId, show: boolean) => void;
  update: (id: LayerId, options: BridgeModalUpdateOptions) => void;
  open: <TProps = Record<string, unknown>>(
    options: BridgeModalOpenOptions<TProps>,
  ) => LayerId;
};

export type BridgeModalApi = Omit<
  BridgeModalController,
  "entries" | "syncShow" | "removeEntry"
> & {
  stackSize: number;
};
