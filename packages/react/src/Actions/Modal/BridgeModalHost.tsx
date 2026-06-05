// ** External Imports
import { createElement, type ReactNode } from "react";

// ** Local Imports
import { BridgeModalContext } from "@/Actions/Modal/BridgeModalContext";
import type { BridgeModalEntry } from "@/Actions/Modal/bridgeModal.types";
import { useBridgeModalController } from "@/Actions/Modal/createBridgeModalController";
import { Modal } from "@/Components/Modal";

export type BridgeModalHostProps = {
  children?: ReactNode;
};

function handleShowChange(
  entry: BridgeModalEntry,
  api: ReturnType<typeof useBridgeModalController>,
  show: boolean,
) {
  if (show) {
    return;
  }

  entry.onClose?.();
  api.removeEntry(entry.id);
  entry.onClosed?.();
}

export function BridgeModalHost({ children }: BridgeModalHostProps) {
  const api = useBridgeModalController();

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
            onClose={entry.onClose}
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
