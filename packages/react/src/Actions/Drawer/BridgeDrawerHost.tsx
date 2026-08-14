// ** External Imports
import {
  completeLayerHide,
  invokeLayerDismiss,
  mergeLayerShellProps,
} from "@bridge-ui/core/Layer";
import { createElement, useContext, useEffect } from "react";

// ** Local Imports
import { BridgeDrawerContext } from "@/Actions/Drawer/BridgeDrawerContext";
import type { BridgeDrawerHostProps } from "@/Actions/Drawer/bridgeDrawer.types";
import { useBridgeDrawerController } from "@/Actions/Drawer/createBridgeDrawerController";
import { Drawer } from "@/Components/Drawer";

const NESTED_HOST_WARNING =
  "[Bridge UI] Nested <BridgeDrawerHost /> detected. useDrawerAction() will target the nearest host only. Remove the extra host.";

export function BridgeDrawerHost({ drawer, children }: BridgeDrawerHostProps) {
  const parentApi = useContext(BridgeDrawerContext);
  const api = useBridgeDrawerController();

  useEffect(() => {
    if (parentApi && process.env.NODE_ENV !== "production") {
      console.warn(NESTED_HOST_WARNING);
    }
  }, [parentApi]);

  return (
    <BridgeDrawerContext.Provider value={api}>
      {children}

      {api.entries.map((entry) => {
        const Component = entry.component;
        const entryId = entry.id;

        return (
          <Drawer
            key={entryId}
            show={entry.show}
            stackId={entryId}
            {...mergeLayerShellProps(drawer, entry.drawer)}
            onClose={() => invokeLayerDismiss(api.entries, entryId)}
            onShowChange={(show) => {
              api.syncShow(entryId, show);
              completeLayerHide(api.entries, entryId, show, api.removeEntry);
            }}
          >
            {createElement(Component, entry.props ?? {})}
          </Drawer>
        );
      })}
    </BridgeDrawerContext.Provider>
  );
}
