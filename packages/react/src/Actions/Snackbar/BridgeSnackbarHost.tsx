// ** External Imports
import {
  completeLayerHide,
  invokeLayerDismiss,
  mergeLayerShellProps,
} from "@bridge-ui/core";
import { useContext, useEffect, type ReactNode } from "react";

// ** Local Imports
import { BridgeSnackbarContext } from "@/Actions/Snackbar/BridgeSnackbarContext";
import type { BridgeSnackbarShellProps } from "@/Actions/Snackbar/bridgeSnackbar.types";
import { useBridgeSnackbarController } from "@/Actions/Snackbar/createBridgeSnackbarController";
import { resolveBridgeSnackbarSlots } from "@/Actions/Snackbar/resolveBridgeSnackbarSlots";
import { Snackbar } from "@/Components/Snackbar";

export type BridgeSnackbarHostProps = {
  children?: ReactNode;
  /**
   * Default shell options merged into every snackbar opened via `useBridgeSnackbar()`.
   * Per-call `open()` options override these.
   */
  snackbar?: BridgeSnackbarShellProps;
  /**
   * Maximum open snackbars. When exceeded, the oldest closes before opening the new one.
   */
  max?: number;
  /**
   * Default auto-dismiss delay (ms). `false` keeps snackbars open until dismissed.
   * Per-call `open({ duration })` overrides this.
   *
   * @default 5000
   */
  timeout?: number | false;
};

const NESTED_HOST_WARNING =
  "[Bridge UI] Nested <BridgeSnackbarHost /> detected. useBridgeSnackbar() will target the nearest host only. Remove the extra host.";

export function BridgeSnackbarHost({
  children,
  snackbar,
  max,
  timeout,
}: BridgeSnackbarHostProps) {
  const parentApi = useContext(BridgeSnackbarContext);
  const api = useBridgeSnackbarController({ max, timeout });

  useEffect(() => {
    if (parentApi && process.env.NODE_ENV !== "production") {
      console.warn(NESTED_HOST_WARNING);
    }
  }, [parentApi]);

  return (
    <BridgeSnackbarContext.Provider value={api}>
      {children}

      {api.entries.map((entry) => {
        const entryId = entry.id;
        const { actions, rightButtons, ...entrySnackbar } = entry.props;

        const snackbarProps = mergeLayerShellProps(snackbar, entrySnackbar);

        return (
          <Snackbar
            key={entryId}
            {...snackbarProps}
            show={entry.show}
            stackId={entryId}
            slots={resolveBridgeSnackbarSlots(
              {
                actions,
                rightButtons,
                dense: snackbarProps.dense,
                color: snackbarProps.color,
              },
              () => api.close(entryId),
            )}
            onClose={() => invokeLayerDismiss(api.entries, entryId)}
            onShowChange={(show) => {
              api.syncShow(entryId, show);
              completeLayerHide(api.entries, entryId, show, api.removeEntry);
            }}
          />
        );
      })}
    </BridgeSnackbarContext.Provider>
  );
}
