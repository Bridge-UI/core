// ** External Imports
import type { LayerId } from "@bridge-ui/core";
import type { Component, Ref } from "vue";

// ** Local Imports
import type { ModalOwnProps } from "@/Components/Modal/modal.types";

export type BridgeModalShellProps = Partial<Omit<ModalOwnProps, "stackId">>;

export type BridgeModalEntry = {
  id: LayerId;
  show: boolean;
  modal?: Partial<ModalOwnProps>;
  props?: Record<string, unknown>;
  component: Component;
  onClose?: () => void;
  onClosed?: () => void;
};

export type BridgeModalOpenOptions<TProps = Record<string, unknown>> = {
  props?: TProps;
  modal?: Partial<ModalOwnProps>;
  component: Component;
  onClose?: () => void;
  onClosed?: () => void;
};

export type BridgeModalUpdateOptions = {
  modal?: Partial<ModalOwnProps>;
  props?: Record<string, unknown>;
};

export type BridgeModalController = {
  entries: Ref<BridgeModalEntry[]>;
  open: <TProps = Record<string, unknown>>(
    options: BridgeModalOpenOptions<TProps>,
  ) => LayerId;
  close: (id: LayerId) => void;
  isOpen: (id: LayerId) => boolean;
  update: (id: LayerId, options: BridgeModalUpdateOptions) => void;
  closeTop: () => void;
  syncShow: (id: LayerId, show: boolean) => void;
  removeEntry: (id: LayerId) => void;
};

export type BridgeModalApi = Omit<
  BridgeModalController,
  "entries" | "syncShow" | "removeEntry"
> & {
  stackSize: number;
};
