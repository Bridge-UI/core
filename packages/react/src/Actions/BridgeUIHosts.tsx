// ** External Imports
import type { ReactNode } from "react";

// ** Local Imports
import { BridgeDialogHost, type BridgeDialogHostProps } from "@/Actions/Dialog";
import { BridgeModalHost, type BridgeModalHostProps } from "@/Actions/Modal";
import {
  BridgeSnackbarHost,
  type BridgeSnackbarHostProps,
} from "@/Actions/Snackbar";

export type BridgeUIHostsProps = {
  children?: ReactNode;
  /**
   * Props forwarded to {@link BridgeSnackbarHost}.
   */
  snackbar?: Omit<BridgeSnackbarHostProps, "children">;
  /**
   * Props forwarded to {@link BridgeDialogHost}.
   */
  dialog?: Omit<BridgeDialogHostProps, "children">;
  /**
   * Props forwarded to {@link BridgeModalHost}.
   */
  modal?: Omit<BridgeModalHostProps, "children">;
};

/**
 * Convenience wrapper that mounts snackbar, dialog, and modal hosts.
 * Use when the app needs `useBridgeSnackbar()`, `useBridgeDialog()`, and/or `useBridgeModal()`.
 */
export function BridgeUIHosts({
  children,
  snackbar,
  dialog,
  modal,
}: BridgeUIHostsProps) {
  return (
    <BridgeSnackbarHost {...snackbar}>
      <BridgeDialogHost {...dialog}>
        <BridgeModalHost {...modal}>{children}</BridgeModalHost>
      </BridgeDialogHost>
    </BridgeSnackbarHost>
  );
}
