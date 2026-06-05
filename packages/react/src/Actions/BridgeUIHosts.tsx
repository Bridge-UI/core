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

/**
 * Convenience wrapper that mounts snackbar, dialog, and modal hosts.
 * Use when the app needs `useSnackbarAction()`, `useDialogAction()`, and/or `useModalAction()`.
 */
export function BridgeUIHosts({
  modal,
  dialog,
  children,
  snackbar,
}: BridgeUIHostsProps) {
  return (
    <BridgeModalHost {...modal}>
      <BridgeDialogHost {...dialog}>
        <BridgeSnackbarHost {...snackbar}>{children}</BridgeSnackbarHost>
      </BridgeDialogHost>
    </BridgeModalHost>
  );
}
