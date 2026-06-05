// ** External Imports
import type { ReactNode } from "react";

// ** Local Imports
import { BridgeModalHost } from "@/Actions/Modal";
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
};

/**
 * Convenience wrapper that mounts {@link BridgeSnackbarHost} and {@link BridgeModalHost}.
 * Use when the app needs both `useBridgeSnackbar()` and `useBridgeModal()`.
 */
export function BridgeUIHosts({ children, snackbar }: BridgeUIHostsProps) {
  return (
    <BridgeSnackbarHost {...snackbar}>
      <BridgeModalHost>{children}</BridgeModalHost>
    </BridgeSnackbarHost>
  );
}
