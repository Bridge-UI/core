// ** External Imports
import type { LayerId } from "@bridge-ui/core";

// ** Local Imports
import type { SnackbarOwnProps } from "@/Components/Snackbar/snackbar.types";

export interface SnackbarAction {
  /**
   * Button label.
   */
  label: string;

  /**
   * Extra Tailwind classes for the action button.
   */
  className?: string;

  /**
   * Whether the action renders as a solid bordered button.
   */
  solid?: boolean;

  /**
   * Called when the action is clicked.
   */
  onClick?: () => void;
}

export interface SnackbarActions {
  /**
   * Primary action (e.g. Undo, Confirm).
   */
  accept?: SnackbarAction;

  /**
   * Secondary action (e.g. Dismiss, Cancel).
   */
  reject?: SnackbarAction;
}

export type BridgeSnackbarContentProps = Omit<
  SnackbarOwnProps,
  "stackId" | "slots" | "teleportTo"
> & {
  /**
   * Preset inline or trailing actions (mapped to slots by the host).
   */
  actions?: SnackbarActions;

  /**
   * Renders `actions` as a vertical column on the right edge.
   *
   * @default false
   */
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
  entries: BridgeSnackbarEntry[];
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
