// ** External Imports
import type { Component } from "vue";

// ** Local Imports
import type { ModalOwnProps } from "@/Components/Modal/modal.types";

export type BridgeModalEntry = {
  id: string;
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

export type BridgeModalController = {
  closeTop: () => void;
  close: (id: string) => void;
  isOpen: (id: string) => boolean;
  removeEntry: (id: string) => void;
  entries: Readonly<{ value: BridgeModalEntry[] }>;
  open: <TProps = Record<string, unknown>>(
    options: BridgeModalOpenOptions<TProps>,
  ) => string;
};

export type BridgeModalApi = Omit<BridgeModalController, "removeEntry"> & {
  stackSize: number;
};
