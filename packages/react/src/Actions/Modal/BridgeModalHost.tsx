// ** External Imports
import {
  completeLayerHide,
  invokeLayerDismiss,
  mergeLayerShellProps,
} from "@bridge-ui/core";
import { createElement, useContext, useEffect } from "react";

// ** Local Imports
import { BridgeModalContext } from "@/Actions/Modal/BridgeModalContext";
import type { BridgeModalHostProps } from "@/Actions/Modal/bridgeModal.types";
import { useBridgeModalController } from "@/Actions/Modal/createBridgeModalController";
import { Modal } from "@/Components/Modal";

const NESTED_HOST_WARNING =
  "[Bridge UI] Nested <BridgeModalHost /> detected. useModalAction() will target the nearest host only. Remove the extra host.";

export function BridgeModalHost({ modal, children }: BridgeModalHostProps) {
  const parentApi = useContext(BridgeModalContext);
  const api = useBridgeModalController();

  useEffect(() => {
    if (parentApi && process.env.NODE_ENV !== "production") {
      console.warn(NESTED_HOST_WARNING);
    }
  }, [parentApi]);

  return (
    <BridgeModalContext.Provider value={api}>
      {children}

      {api.entries.map((entry) => {
        const Component = entry.component;
        const entryId = entry.id;

        return (
          <Modal
            key={entryId}
            show={entry.show}
            stackId={entryId}
            {...mergeLayerShellProps(modal, entry.modal)}
            onClose={() => invokeLayerDismiss(api.entries, entryId)}
            onShowChange={(show) => {
              api.syncShow(entryId, show);
              completeLayerHide(api.entries, entryId, show, api.removeEntry);
            }}
          >
            {createElement(Component, entry.props ?? {})}
          </Modal>
        );
      })}
    </BridgeModalContext.Provider>
  );
}
