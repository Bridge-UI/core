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
   * Default Modal shell options merged into every dialog opened via `useDialogAction()`.
   * Per-call `open({ modal })` overrides these.
   */
  modal?: BridgeDialogShellProps;
};

const NESTED_HOST_WARNING =
  "[Bridge UI] Nested <BridgeDialogHost /> detected. useDialogAction() will target the nearest host only. Remove the extra host.";

export function BridgeDialogHost({ modal, children }: BridgeDialogHostProps) {
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
          card,
          title,
          actions,
          description,
          color = "primary",
        } = entry.props;

        const dismissFromAction = () => {
          return api.close(entryId);
        };

        const dismissFromModal = () => {
          return invokeLayerDismiss(api.entries, entryId);
        };

        return (
          <Modal
            key={entryId}
            show={entry.show}
            stackId={entryId}
            onClose={dismissFromModal}
            {...mergeLayerShellProps(modal, entry.modal)}
            onShowChange={(show) => {
              api.syncShow(entryId, show);
              completeLayerHide(api.entries, entryId, show, api.removeEntry);
            }}
          >
            <Card
              {...card}
              title={title}
              slots={{
                footer: resolveBridgeDialogFooter({
                  actions: actions,
                  acceptColor: color,
                  dismiss: dismissFromAction,
                }),
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
