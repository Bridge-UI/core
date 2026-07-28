// ** Local Imports
import type { BridgeUIHostsProps } from "@/Actions/bridgeUIHosts.types";
import { BridgeDialogHost } from "@/Actions/Dialog";
import { BridgeDrawerHost } from "@/Actions/Drawer";
import { BridgeModalHost } from "@/Actions/Modal";
import { BridgeSnackbarHost } from "@/Actions/Snackbar";

/**
 * Convenience wrapper that mounts snackbar, dialog, modal, and drawer hosts.
 * Use when the app needs `useSnackbarAction()`, `useDialogAction()`, `useModalAction()`, and/or `useDrawerAction()`.
 */
export function BridgeUIHosts({
  modal,
  dialog,
  drawer,
  children,
  snackbar,
}: BridgeUIHostsProps) {
  return (
    <BridgeModalHost {...modal}>
      <BridgeDrawerHost {...drawer}>
        <BridgeDialogHost {...dialog}>
          <BridgeSnackbarHost {...snackbar}>{children}</BridgeSnackbarHost>
        </BridgeDialogHost>
      </BridgeDrawerHost>
    </BridgeModalHost>
  );
}
