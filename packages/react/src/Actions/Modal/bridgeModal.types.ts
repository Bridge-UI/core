// ** External Imports
import type { ComponentType } from "react";

// ** Local Imports
import type { ModalOwnProps } from "@/Components/Modal/modal.types";

export type BridgeModalEntry = {
  id: string;
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
  close: (id: string) => void;
  isOpen: (id: string) => boolean;
  removeEntry: (id: string) => void;
  syncShow: (id: string, show: boolean) => void;
  update: (id: string, options: BridgeModalUpdateOptions) => void;
  open: <TProps = Record<string, unknown>>(
    options: BridgeModalOpenOptions<TProps>,
  ) => string;
};

export type BridgeModalApi = Omit<
  BridgeModalController,
  "entries" | "syncShow" | "removeEntry"
> & {
  stackSize: number;
};
