// ** External Imports
import type { LayerId, SnackbarColor } from "@bridge-ui/core";

// ** Local Imports
import type { ButtonOwnProps } from "@/Components/Button/button.types";
import type { LinkOwnProps } from "@/Components/Link/link.types";
import type { SnackbarOwnProps } from "@/Components/Snackbar/snackbar.types";

export interface SnackbarAction {
  /**
   * Button label.
   */
  label: string;

  /**
   * Extra Tailwind classes for the action control (`classes.root`).
   */
  className?: string;

  /**
   * Whether the action renders as a solid bordered button.
   */
  solid?: boolean;

  /**
   * Props merged into the default `Button` (ignored when `link` is set).
   */
  button?: Partial<Omit<ButtonOwnProps, "children">>;

  /**
   * When set, renders a `Link` instead of a `Button`.
   */
  link?: Partial<Omit<LinkOwnProps, "children">>;

  /**
   * Called when the action is clicked.
   */
  onClick?: () => void;
}

export interface SnackbarActions {
  /**
   * Primary action (e.g. Undo, Confirm). Uses the snackbar `color` by default.
   */
  accept?: SnackbarAction;

  /**
   * Secondary action (e.g. Dismiss, Cancel). Uses `secondary` by default.
   */
  reject?: SnackbarAction;
}

export type BridgeSnackbarShellProps = Partial<
  Omit<SnackbarOwnProps, "show" | "stackId" | "slots">
>;

export type BridgeSnackbarContentProps = BridgeSnackbarShellProps & {
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
  closeTop: () => void;
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
  stackSize: number;
};

export type SnackbarActionColor = keyof SnackbarColor;
