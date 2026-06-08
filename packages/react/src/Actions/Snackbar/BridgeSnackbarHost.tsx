// ** External Imports
import {
  completeLayerHide,
  invokeLayerDismiss,
  mergeLayerShellProps,
} from "@bridge-ui/core";
import { get } from "es-toolkit/compat";
import { useContext, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

// ** Core Imports
import {
  cn,
  hasDocument,
  mergeBridgeUILayeredClasses,
  resolveModalPortalElement,
  snackbarPositionProps,
} from "@bridge-ui/core";

// ** Local Imports
import { BridgeSnackbarContext } from "@/Actions/Snackbar/BridgeSnackbarContext";
import type { BridgeSnackbarHostProps } from "@/Actions/Snackbar/bridgeSnackbar.types";
import { useBridgeSnackbarController } from "@/Actions/Snackbar/createBridgeSnackbarController";
import { resolveBridgeSnackbarSlots } from "@/Actions/Snackbar/resolveBridgeSnackbarSlots";
import { Snackbar } from "@/Components/Snackbar";
import { useBridgeUI } from "@/Provider/useBridgeUI";
import { derived } from "@/Utils";

const NESTED_HOST_WARNING =
  "[Bridge UI] Nested <BridgeSnackbarHost /> detected. useSnackbarAction() will target the nearest host only. Remove the extra host.";

export function BridgeSnackbarHost({
  max,
  timeout,
  children,
  position,
  teleportTo = "body",
  snackbar: hostSnackbar,
}: BridgeSnackbarHostProps) {
  const parentApi = useContext(BridgeSnackbarContext);

  const api = useBridgeSnackbarController({ max, timeout });

  const bridge = useBridgeUI();

  useEffect(() => {
    if (parentApi && process.env.NODE_ENV !== "production") {
      console.warn(NESTED_HOST_WARNING);
    }
  }, [parentApi]);

  const snackbarEntry = bridge?.components?.Snackbar;

  const resolvedPosition = derived(() => {
    return position ?? snackbarEntry?.defaultProps?.position ?? "bottom-center";
  });

  const positionClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      snackbarPositionProps,
      snackbarEntry?.customProps?.position,
    );

    return get(classes, resolvedPosition);
  }, [resolvedPosition, snackbarEntry?.customProps?.position]);

  const stackDirectionClass = derived(() => {
    return resolvedPosition.startsWith("top") ? "flex-col" : "flex-col-reverse";
  });

  const stack = (
    <div
      data-snackbar-host
      className={cn(
        "fixed inset-0 z-40 flex pointer-events-none px-4 py-6 sm:p-5 sm:pt-4",
        positionClass,
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-sm gap-y-2 pointer-events-auto",
          stackDirectionClass,
        )}
      >
        {api.entries.map((entry) => {
          const entryId = entry.id;
          const { actions, rightButtons, ...entrySnackbar } = entry.props;

          const snackbarProps = mergeLayerShellProps(
            hostSnackbar,
            entrySnackbar,
          );

          return (
            <Snackbar
              key={entryId}
              {...snackbarProps}
              show={entry.show}
              stackId={entryId}
              teleportTo={false}
              slots={resolveBridgeSnackbarSlots(
                {
                  actions,
                  rightButtons,
                  color: snackbarProps.color,
                  dense: snackbarProps.dense,
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
      </div>
    </div>
  );

  const portalElement = derived(() => {
    if (teleportTo === false || !hasDocument()) {
      return null;
    }

    return resolveModalPortalElement(teleportTo);
  });

  return (
    <BridgeSnackbarContext.Provider value={api}>
      {children}
      {portalElement ? createPortal(stack, portalElement) : stack}
    </BridgeSnackbarContext.Provider>
  );
}
