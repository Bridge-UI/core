// ** External Imports
import type { LayerId } from "@bridge-ui/core";
import type { Ref } from "vue";

// ** Local Imports
import type { SnackbarOwnProps } from "@/Components/Snackbar/snackbar.types";

export interface SnackbarAction {
  label: string;
  class?: string;
  solid?: boolean;
  onClick?: () => void;
}

export interface SnackbarActions {
  accept?: SnackbarAction;
  reject?: SnackbarAction;
}

export type BridgeSnackbarContentProps = Omit<
  SnackbarOwnProps,
  "stackId" | "teleportTo"
> & {
  actions?: SnackbarActions;
  rightButtons?: boolean;
};

export type BridgeSnackbarEntry = {
  id: LayerId;
  show: boolean;
  onClose?: () => void;
  onClosed?: () => void;
  props: BridgeSnackbarContentProps;
};

export type BridgeSnackbarOpenOptions = BridgeSnackbarContentProps & {
  onClose?: () => void;
  onClosed?: () => void;
};

export type BridgeSnackbarUpdateOptions = {
  props?: Partial<BridgeSnackbarContentProps>;
};

export type BridgeSnackbarController = {
  entries: Ref<BridgeSnackbarEntry[]>;
  open: (options: BridgeSnackbarOpenOptions) => LayerId;
  close: (id: LayerId) => void;
  closeAll: () => void;
  isOpen: (id: LayerId) => boolean;
  removeEntry: (id: LayerId) => void;
  syncShow: (id: LayerId, show: boolean) => void;
  update: (id: LayerId, options: BridgeSnackbarUpdateOptions) => void;
};

export type BridgeSnackbarApi = Omit<
  BridgeSnackbarController,
  "entries" | "syncShow" | "removeEntry"
> & {
  count: number;
};
