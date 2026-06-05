// ** External Imports
import type { LayerId } from "@bridge-ui/core";
import type { Component, Ref } from "vue";

// ** Local Imports
import type { ModalOwnProps } from "@/Components/Modal/modal.types";

export type BridgeModalShellProps = Partial<Omit<ModalOwnProps, "stackId">>;

export type BridgeModalEntry = {
  id: LayerId;
  show: boolean;
  component: Component;
  onClose?: () => void;
  onClosed?: () => void;
  modal?: Partial<ModalOwnProps>;
  props?: Record<string, unknown>;
};

export type BridgeModalOpenOptions<TProps = Record<string, unknown>> = {
  props?: TProps;
  component: Component;
  onClose?: () => void;
  onClosed?: () => void;
  modal?: Partial<ModalOwnProps>;
};

export type BridgeModalUpdateOptions = {
  modal?: Partial<ModalOwnProps>;
  props?: Record<string, unknown>;
};

export type BridgeModalController = {
  closeTop: () => void;
  close: (id: LayerId) => void;
  isOpen: (id: LayerId) => boolean;
  entries: Ref<BridgeModalEntry[]>;
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
