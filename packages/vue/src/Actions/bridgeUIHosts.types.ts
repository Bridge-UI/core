// ** Local Imports
import type { BridgeDialogHostProps } from "@/Actions/Dialog/bridgeDialog.types";
import type { BridgeModalHostProps } from "@/Actions/Modal/bridgeModal.types";
import type { BridgeSnackbarHostProps } from "@/Actions/Snackbar/bridgeSnackbar.types";

export type BridgeUIHostsProps = {
  /**
   * Props forwarded to {@link BridgeDialogHost}.
   */
  dialog?: BridgeDialogHostProps;

  /**
   * Props forwarded to {@link BridgeModalHost}.
   */
  modal?: BridgeModalHostProps;

  /**
   * Props forwarded to {@link BridgeSnackbarHost}.
   */
  snackbar?: BridgeSnackbarHostProps;
};
