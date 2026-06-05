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
  actions?: DialogActions;
  acceptColor: keyof ButtonColor;
  dismiss: () => void;
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
  show: boolean;
  modal?: Partial<ModalOwnProps>;
  props: BridgeDialogContentProps;
  onClose?: () => void;
  onClosed?: () => void;
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
  entries: Ref<BridgeDialogEntry[]>;
  open: (options: BridgeDialogOpenOptions) => LayerId;
  close: (id: LayerId) => void;
  isOpen: (id: LayerId) => boolean;
  update: (id: LayerId, options: BridgeDialogUpdateOptions) => void;
  closeTop: () => void;
  syncShow: (id: LayerId, show: boolean) => void;
  removeEntry: (id: LayerId) => void;
};

export type BridgeDialogApi = Omit<
  BridgeDialogController,
  "entries" | "syncShow" | "removeEntry"
> & {
  stackSize: number;
};
