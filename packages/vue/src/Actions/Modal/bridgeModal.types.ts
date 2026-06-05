// ** External Imports
import type { Component, Ref } from "vue";

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

export type BridgeModalUpdateOptions = {
  modal?: Partial<ModalOwnProps>;
  props?: Record<string, unknown>;
};

export type BridgeModalController = {
  closeTop: () => void;
  close: (id: string) => void;
  isOpen: (id: string) => boolean;
  entries: Ref<BridgeModalEntry[]>;
  removeEntry: (id: string) => void;
  update: (id: string, options: BridgeModalUpdateOptions) => void;
  open: <TProps = Record<string, unknown>>(
    options: BridgeModalOpenOptions<TProps>,
  ) => string;
};

export type BridgeModalApi = Omit<
  BridgeModalController,
  "entries" | "removeEntry"
> & {
  stackSize: number;
};
