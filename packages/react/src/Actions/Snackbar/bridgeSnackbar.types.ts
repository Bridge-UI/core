// ** External Imports
import type { LayerId, SnackbarColor } from "@bridge-ui/core";
import { snackbarPositionProps } from "@bridge-ui/core";
import type { ReactNode } from "react";

// ** Local Imports
import type { ButtonOwnProps } from "@/Components/Button/button.types";
import type { LinkProps } from "@/Components/Link/link.types";
import type { SnackbarOwnProps } from "@/Components/Snackbar/snackbar.types";

export interface SnackbarAction {
  /**
   * Props merged into the default `Button` (ignored when `link` is set).
   */
  button?: Partial<Omit<ButtonOwnProps, "children">>;

  /**
   * Extra Tailwind classes for the action control (`classes.root`).
   */
  className?: string;

  /**
   * Button label.
   */
  label: string;

  /**
   * When set, renders a `Link` instead of a `Button`.
   */
  link?: Partial<Omit<LinkProps, "children">>;

  /**
   * Called when the action is clicked.
   */
  onClick?: () => void;

  /**
   * Whether the action renders as a solid bordered button.
   */
  solid?: boolean;
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

export type SnackbarActionLayout =
  | "inline"
  | "trailing"
  | "right-accept"
  | "right-reject";

export type SnackbarActionColor = keyof SnackbarColor;

export type BridgeSnackbarActionProps = {
  action: SnackbarAction;
  hasAccept?: boolean;
  hasReject?: boolean;
  layout: SnackbarActionLayout;
  role: "accept" | "reject";
  snackbarColor: SnackbarActionColor;
};

export type SnackbarActionControlProps = BridgeSnackbarActionProps & {
  onRun: () => void;
};

export type BridgeSnackbarHostProps = {
  /**
   * The children to apply to the host.
   */
  children?: ReactNode;

  /**
   * Maximum open snackbars. When exceeded, the oldest closes before opening the new one.
   */
  max?: number;

  /**
   * Notification stack position on the viewport.
   *
   * @default "bottom-center"
   */
  position?: keyof typeof snackbarPositionProps;

  /**
   * Default shell options merged into every snackbar opened via `useSnackbarAction()`.
   * Per-call `open()` options override these.
   */
  snackbar?: BridgeSnackbarShellProps;

  /**
   * Portal target for the notification stack. `false` renders inline.
   *
   * @default "body"
   */
  teleportTo?: string | false;

  /**
   * Default auto-dismiss delay (ms). `false` keeps snackbars open until dismissed.
   * Per-call `open({ duration })` overrides this.
   */
  timeout?: number | false;
};

export type BridgeSnackbarItemProps = {
  api: BridgeSnackbarController;
  entry: BridgeSnackbarEntry;
  hostSnackbar?: BridgeSnackbarShellProps;
};

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
  onClose?: () => void;
  onClosed?: () => void;
  props: BridgeSnackbarContentProps;
  show: boolean;
};

export type BridgeSnackbarOpenOptions = BridgeSnackbarContentProps & {
  onClose?: () => void;
  onClosed?: () => void;
};

export type BridgeSnackbarUpdateOptions = {
  props?: Partial<BridgeSnackbarContentProps>;
};

export type BridgeSnackbarController = {
  close: (id: LayerId) => void;
  closeAll: () => void;
  closeTop: () => void;
  entries: BridgeSnackbarEntry[];
  isOpen: (id: LayerId) => boolean;
  open: (options: BridgeSnackbarOpenOptions) => LayerId;
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
