// ** External Imports
import type { LayerId } from "@bridge-ui/core";
import type { Component, Ref } from "vue";

// ** Local Imports
import type { ModalOwnProps } from "@/Components/Modal/modal.types";

export type BridgeModalShellProps = Partial<Omit<ModalOwnProps, "stackId">>;

export type BridgeModalEntry = {
  component: Component;
  id: LayerId;
  modal?: Partial<ModalOwnProps>;
  onClose?: () => void;
  onClosed?: () => void;
  props?: Record<string, unknown>;
  show: boolean;
};

export type BridgeModalOpenOptions<TProps = Record<string, unknown>> = {
  component: Component;
  modal?: Partial<ModalOwnProps>;
  onClose?: () => void;
  onClosed?: () => void;
  props?: TProps;
};

export type BridgeModalUpdateOptions = {
  modal?: Partial<ModalOwnProps>;
  props?: Record<string, unknown>;
};

export type BridgeModalController = {
  close: (id: LayerId) => void;
  closeTop: () => void;
  entries: Ref<BridgeModalEntry[]>;
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
