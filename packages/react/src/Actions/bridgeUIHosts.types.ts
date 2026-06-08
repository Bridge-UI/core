// ** External Imports
import type { ReactNode } from "react";

// ** Local Imports
import type { BridgeDialogHostProps } from "@/Actions/Dialog/bridgeDialog.types";
import type { BridgeModalHostProps } from "@/Actions/Modal/bridgeModal.types";
import type { BridgeSnackbarHostProps } from "@/Actions/Snackbar/bridgeSnackbar.types";

export type BridgeUIHostsProps = {
  /**
   * The children to apply to the hosts.
   */
  children?: ReactNode;

  /**
   * Props forwarded to {@link BridgeDialogHost}.
   */
  dialog?: Omit<BridgeDialogHostProps, "children">;

  /**
   * Props forwarded to {@link BridgeModalHost}.
   */
  modal?: Omit<BridgeModalHostProps, "children">;

  /**
   * Props forwarded to {@link BridgeSnackbarHost}.
   */
  snackbar?: Omit<BridgeSnackbarHostProps, "children">;
};
