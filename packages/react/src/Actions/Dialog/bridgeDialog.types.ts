// ** External Imports
import type { ButtonColor, LayerId } from "@bridge-ui/core";

// ** Local Imports
import type {
  SnackbarAction,
  SnackbarActions,
} from "@/Actions/Snackbar/bridgeSnackbar.types";
import type { CardOwnProps } from "@/Components/Card/card.types";
import type { ModalOwnProps } from "@/Components/Modal/modal.types";

export type DialogAction = SnackbarAction;

export type DialogActions = SnackbarActions;

export type BridgeDialogShellProps = Partial<
  Omit<ModalOwnProps, "show" | "stackId">
>;

export type BridgeDialogContentProps = {
  /**
   * Dialog title (rendered in the Card header).
   */
  title: string;

  /**
   * Optional body text below the title.
   */
  description?: string;

  /**
   * Footer actions (accept = primary, reject = secondary by default).
   */
  actions?: DialogActions;

  /**
   * Color for the accept action button.
   *
   * @default "primary"
   */
  color?: keyof ButtonColor;

  /**
   * Extra Card shell options (padding, variant, classes, etc.).
   */
  card?: Partial<Omit<CardOwnProps, "children" | "slots" | "title">>;
};

export type BridgeDialogEntry = {
  id: LayerId;
  show: boolean;
  onClose?: () => void;
  onClosed?: () => void;
  modal?: Partial<ModalOwnProps>;
  props: BridgeDialogContentProps;
};

export type BridgeDialogOpenOptions = BridgeDialogContentProps & {
  modal?: BridgeDialogShellProps;
  onClose?: () => void;
  onClosed?: () => void;
};

export type BridgeDialogUpdateOptions = {
  props?: Partial<BridgeDialogContentProps>;
  modal?: Partial<ModalOwnProps>;
};

export type BridgeDialogController = {
  entries: BridgeDialogEntry[];
  open: (options: BridgeDialogOpenOptions) => LayerId;
  close: (id: LayerId) => void;
  closeTop: () => void;
  isOpen: (id: LayerId) => boolean;
  removeEntry: (id: LayerId) => void;
  syncShow: (id: LayerId, show: boolean) => void;
  update: (id: LayerId, options: BridgeDialogUpdateOptions) => void;
};

export type BridgeDialogApi = Omit<
  BridgeDialogController,
  "entries" | "syncShow" | "removeEntry"
> & {
  stackSize: number;
};
