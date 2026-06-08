// ** External Imports
import type { ButtonColor, LayerId } from "@bridge-ui/core";
import type { Ref } from "vue";

// ** Local Imports
import type { ButtonOwnProps } from "@/Components/Button/button.types";
import type { CardOwnProps } from "@/Components/Card/card.types";
import type { LinkProps } from "@/Components/Link/link.types";
import type { ModalOwnProps } from "@/Components/Modal/modal.types";

export interface DialogAction {
  /**
   * Props merged into the default `Button` (ignored when `link` is set).
   */
  button?: Partial<Omit<ButtonOwnProps, "children">>;

  /**
   * Extra Tailwind classes merged into the action root (`classes.root`).
   */
  className?: string;

  /**
   * Footer button or link label.
   */
  label: string;

  /**
   * When set, renders a `Link` instead of a `Button`.
   */
  link?: Partial<Omit<LinkProps, "children">>;

  /**
   * Called when the action is activated, before the dialog dismisses.
   */
  onClick?: () => void;

  /**
   * When `true`, renders the button with the `outline` variant instead of `flat`.
   */
  solid?: boolean;
}

export interface DialogActions {
  /**
   * Primary footer action (e.g. Confirm, Save). Uses the dialog `color` by default.
   */
  accept?: DialogAction;

  /**
   * Secondary footer action (e.g. Cancel, Dismiss). Uses `secondary` by default.
   */
  reject?: DialogAction;
}

export type ResolveBridgeDialogFooterOptions = {
  acceptColor: keyof ButtonColor;
  actions?: DialogActions;
  dismiss: () => void;
};

export type BridgeDialogActionProps = {
  /**
   * Color for the accept action. Reject always uses `secondary`.
   */
  acceptColor: keyof ButtonColor;

  /**
   * Footer action configuration (label, button/link, handlers).
   */
  action: DialogAction;

  /**
   * Whether this control renders the primary or secondary footer action.
   */
  role: "accept" | "reject";
};

export type BridgeDialogHostProps = {
  /**
   * Default Modal shell options merged into every dialog opened via `useDialogAction()`.
   * Per-call `open({ modal })` overrides these.
   */
  modal?: BridgeDialogShellProps;
};

export type BridgeDialogItemProps = {
  api: BridgeDialogController;
  entry: BridgeDialogEntry;
  hostModal?: BridgeDialogShellProps;
};

export type BridgeDialogShellProps = Partial<Omit<ModalOwnProps, "stackId">>;

export type BridgeDialogContentProps = {
  /**
   * Footer actions (accept = primary, reject = secondary by default).
   */
  actions?: DialogActions;

  /**
   * Extra Card shell options (padding, variant, classes, etc.).
   */
  card?: Partial<Omit<CardOwnProps, "children" | "slots" | "title">>;

  /**
   * Color for the accept action button.
   *
   * @default "primary"
   */
  color?: keyof ButtonColor;

  /**
   * Optional body text below the title.
   */
  description?: string;

  /**
   * Dialog title (rendered in the Card header).
   */
  title: string;
};

export type BridgeDialogEntry = {
  id: LayerId;
  modal?: Partial<ModalOwnProps>;
  onClose?: () => void;
  onClosed?: () => void;
  props: BridgeDialogContentProps;
  show: boolean;
};

export type BridgeDialogOpenOptions = BridgeDialogContentProps & {
  modal?: BridgeDialogShellProps;
  onClose?: () => void;
  onClosed?: () => void;
};

export type BridgeDialogUpdateOptions = {
  modal?: Partial<ModalOwnProps>;
  props?: Partial<BridgeDialogContentProps>;
};

export type BridgeDialogController = {
  close: (id: LayerId) => void;
  closeTop: () => void;
  entries: Ref<BridgeDialogEntry[]>;
  isOpen: (id: LayerId) => boolean;
  open: (options: BridgeDialogOpenOptions) => LayerId;
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
