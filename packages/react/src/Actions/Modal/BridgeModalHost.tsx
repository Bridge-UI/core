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

function findEntry(
  entries: BridgeModalEntry[],
  id: string,
): BridgeModalEntry | undefined {
  return entries.find((entry) => entry.id === id);
}

function handleDismiss(
  id: string,
  api: ReturnType<typeof useBridgeModalController>,
) {
  const entry = findEntry(api.entries, id);

  if (!entry?.show) {
    return;
  }

  entry.onClose?.();
}

function handleShowChange(
  id: string,
  api: ReturnType<typeof useBridgeModalController>,
  show: boolean,
) {
  if (show) {
    return;
  }

  const entry = findEntry(api.entries, id);

  api.removeEntry(id);
  entry?.onClosed?.();
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
        const entryId = entry.id;

        return (
          <Modal
            key={entryId}
            show={entry.show}
            stackId={entryId}
            onClose={() => handleDismiss(entryId, api)}
            onShowChange={(show) => handleShowChange(entryId, api, show)}
            {...entry.modal}
          >
            {createElement(Component, entry.props ?? {})}
          </Modal>
        );
      })}
    </BridgeModalContext.Provider>
  );
}
