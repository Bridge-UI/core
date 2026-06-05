// ** External Imports
import { createElement, useContext, useEffect, type ReactNode } from "react";

// ** Local Imports
import { BridgeModalContext } from "@/Actions/Modal/BridgeModalContext";
import type { BridgeModalEntry } from "@/Actions/Modal/bridgeModal.types";
import { useBridgeModalController } from "@/Actions/Modal/createBridgeModalController";
import { Modal } from "@/Components/Modal";

export type BridgeModalHostProps = {
  children?: ReactNode;
};

const NESTED_HOST_WARNING =
  "[Bridge UI] Nested <BridgeModalHost /> detected. useBridgeModal() will target the nearest host only. Remove the extra host or rely on <BridgeUIProvider />.";

function handleDismiss(entry: BridgeModalEntry) {
  if (!entry.show) {
    return;
  }

  entry.onClose?.();
}

function handleShowChange(
  entry: BridgeModalEntry,
  api: ReturnType<typeof useBridgeModalController>,
  show: boolean,
) {
  if (show) {
    return;
  }

  api.removeEntry(entry.id);
  entry.onClosed?.();
}

export function BridgeModalHost({ children }: BridgeModalHostProps) {
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

        return (
          <Modal
            key={entry.id}
            show={entry.show}
            stackId={entry.id}
            onClose={() => handleDismiss(entry)}
            onShowChange={(show) => handleShowChange(entry, api, show)}
            {...entry.modal}
          >
            {createElement(Component, entry.props ?? {})}
          </Modal>
        );
      })}
    </BridgeModalContext.Provider>
  );
}
