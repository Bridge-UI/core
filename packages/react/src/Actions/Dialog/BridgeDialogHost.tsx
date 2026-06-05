// ** External Imports
import {
  completeLayerHide,
  invokeLayerDismiss,
  mergeLayerShellProps,
} from "@bridge-ui/core";
import { useContext, useEffect, type ReactNode } from "react";

// ** Local Imports
import { BridgeDialogContext } from "@/Actions/Dialog/BridgeDialogContext";
import type { BridgeDialogShellProps } from "@/Actions/Dialog/bridgeDialog.types";
import { useBridgeDialogController } from "@/Actions/Dialog/createBridgeDialogController";
import { resolveBridgeDialogFooter } from "@/Actions/Dialog/resolveBridgeDialogFooter";
import { Card } from "@/Components/Card";
import { Modal } from "@/Components/Modal";

export type BridgeDialogHostProps = {
  children?: ReactNode;
  /**
   * Default Modal shell options merged into every dialog opened via `useBridgeDialog()`.
   * Per-call `open({ modal })` overrides these.
   */
  modal?: BridgeDialogShellProps;
};

const NESTED_HOST_WARNING =
  "[Bridge UI] Nested <BridgeDialogHost /> detected. useBridgeDialog() will target the nearest host only. Remove the extra host.";

export function BridgeDialogHost({ children, modal }: BridgeDialogHostProps) {
  const parentApi = useContext(BridgeDialogContext);
  const api = useBridgeDialogController();

  useEffect(() => {
    if (parentApi && process.env.NODE_ENV !== "production") {
      console.warn(NESTED_HOST_WARNING);
    }
  }, [parentApi]);

  return (
    <BridgeDialogContext.Provider value={api}>
      {children}

      {api.entries.map((entry) => {
        const entryId = entry.id;
        const {
          title,
          description,
          actions,
          color = "primary",
          card,
        } = entry.props;

        const dismissFromModal = () => invokeLayerDismiss(api.entries, entryId);

        const dismissFromAction = () => api.close(entryId);

        return (
          <Modal
            key={entryId}
            {...mergeLayerShellProps(modal, entry.modal)}
            show={entry.show}
            stackId={entryId}
            onClose={dismissFromModal}
            onShowChange={(show) => {
              api.syncShow(entryId, show);
              completeLayerHide(api.entries, entryId, show, api.removeEntry);
            }}
          >
            <Card
              title={title}
              {...card}
              slots={{
                footer: resolveBridgeDialogFooter(
                  actions,
                  color,
                  dismissFromAction,
                ),
              }}
            >
              {description && (
                <p className="text-sm text-dark-500 dark:text-dark-400">
                  {description}
                </p>
              )}
            </Card>
          </Modal>
        );
      })}
    </BridgeDialogContext.Provider>
  );
}
