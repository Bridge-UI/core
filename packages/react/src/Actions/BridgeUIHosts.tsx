// ** Local Imports
import type { BridgeUIHostsProps } from "@/Actions/bridgeUIHosts.types";
import { BridgeDialogHost } from "@/Actions/Dialog";
import { BridgeModalHost } from "@/Actions/Modal";
import { BridgeSnackbarHost } from "@/Actions/Snackbar";

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
