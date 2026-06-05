// ** External Imports
import { completeLayerHide, invokeLayerDismiss } from "@bridge-ui/core";
import { get } from "es-toolkit/compat";
import { useContext, useEffect, useMemo, type ReactNode } from "react";
import { createPortal } from "react-dom";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  resolveModalPortalElement,
  snackbarPositionProps,
} from "@bridge-ui/core";

// ** Local Imports
import { BridgeSnackbarContext } from "@/Actions/Snackbar/BridgeSnackbarContext";
import { useBridgeSnackbarController } from "@/Actions/Snackbar/createBridgeSnackbarController";
import { resolveBridgeSnackbarSlots } from "@/Actions/Snackbar/resolveBridgeSnackbarSlots";
import { Snackbar } from "@/Components/Snackbar";
import { useBridgeUI } from "@/Provider/useBridgeUI";

export type BridgeSnackbarHostProps = {
  children?: ReactNode;
  /**
   * Stack position on the viewport.
   *
   * @default "bottom-center"
   */
  position?: keyof typeof snackbarPositionProps;
  /**
   * Portal target. `false` renders inline.
   *
   * @default "body"
   */
  teleportTo?: string | false;
};

const NESTED_HOST_WARNING =
  "[Bridge UI] Nested <BridgeSnackbarHost /> detected. useBridgeSnackbar() will target the nearest host only. Remove the extra host or rely on <BridgeUIProvider />.";

export function BridgeSnackbarHost({
  children,
  position,
  teleportTo = "body",
}: BridgeSnackbarHostProps) {
  const parentApi = useContext(BridgeSnackbarContext);
  const api = useBridgeSnackbarController();
  const bridge = useBridgeUI();

  useEffect(() => {
    if (parentApi && process.env.NODE_ENV !== "production") {
      console.warn(NESTED_HOST_WARNING);
    }
  }, [parentApi]);

  const snackbarEntry = bridge?.components?.Snackbar;

  const resolvedPosition =
    position ?? snackbarEntry?.defaultProps?.position ?? "bottom-center";

  const positionClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      snackbarPositionProps,
      snackbarEntry?.customProps?.position,
    );

    return get(classes, resolvedPosition);
  }, [resolvedPosition, snackbarEntry?.customProps?.position]);

  const stack = (
    <div
      data-snackbar-host
      className={cn(
        "fixed inset-0 z-40 flex pointer-events-none px-4 py-6 sm:p-5 sm:pt-4",
        positionClass,
      )}
    >
      <div className="flex flex-col-reverse w-full max-w-sm gap-y-2 pointer-events-auto">
        {api.entries.map((entry) => {
          const { actions, rightButtons, ...snackbarProps } = entry.props;

          const dismiss = () => invokeLayerDismiss(api.entries, entry.id);

          return (
            <Snackbar
              key={entry.id}
              show={entry.show}
              stackId={entry.id}
              teleportTo={false}
              {...snackbarProps}
              slots={resolveBridgeSnackbarSlots(
                { actions, rightButtons, dense: snackbarProps.dense },
                dismiss,
              )}
              onClose={dismiss}
              onShowChange={(show) => {
                api.syncShow(entry.id, show);
                completeLayerHide(api.entries, entry.id, show, api.removeEntry);
              }}
            />
          );
        })}
      </div>
    </div>
  );

  const portalElement =
    teleportTo === false || typeof document === "undefined"
      ? null
      : resolveModalPortalElement(teleportTo);

  return (
    <BridgeSnackbarContext.Provider value={api}>
      {children}
      {portalElement ? createPortal(stack, portalElement) : stack}
    </BridgeSnackbarContext.Provider>
  );
}
