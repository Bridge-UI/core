// ** External Imports
import type { SnackbarColor } from "@bridge-ui/core";

// ** Local Imports
import type { BridgeSnackbarContentProps } from "@/Actions/Snackbar/bridgeSnackbar.types";
import { SnackbarActionControl } from "@/Actions/Snackbar/SnackbarActionControl";
import type { SnackbarSlots } from "@/Components/Snackbar/snackbar.types";

export function resolveBridgeSnackbarSlots(
  props: Pick<
    BridgeSnackbarContentProps,
    "actions" | "rightButtons" | "dense" | "color"
  >,
  close: () => void,
): SnackbarSlots | undefined {
  const { actions, rightButtons, dense, color = "primary" } = props;

  if (!actions?.accept && !actions?.reject) {
    return undefined;
  }

  const snackbarColor = color as keyof SnackbarColor;
  const slots: SnackbarSlots = {};

  if (rightButtons) {
    slots.right = (
      <div className="flex flex-col border-l border-dark-200 dark:border-dark-700">
        {actions.accept?.label && (
          <div
            className={
              actions.reject
                ? "flex flex-1 h-0 border-b border-dark-200 dark:border-dark-700"
                : "flex flex-1 h-0"
            }
          >
            <SnackbarActionControl
              role="accept"
              action={actions.accept}
              snackbarColor={snackbarColor}
              layout="right-accept"
              hasReject={Boolean(actions.reject)}
              onRun={() => {
                actions.accept?.onClick?.();
                close();
              }}
            />
          </div>
        )}

        {actions.reject?.label && (
          <div className="flex flex-1 h-0">
            <SnackbarActionControl
              role="reject"
              action={actions.reject}
              snackbarColor={snackbarColor}
              layout="right-reject"
              hasAccept={Boolean(actions.accept)}
              onRun={() => {
                actions.reject?.onClick?.();
                close();
              }}
            />
          </div>
        )}
      </div>
    );

    return slots;
  }

  if (dense && actions.accept?.label) {
    slots.trailing = (
      <SnackbarActionControl
        role="accept"
        action={actions.accept}
        snackbarColor={snackbarColor}
        layout="trailing"
        onRun={() => {
          actions.accept?.onClick?.();
          close();
        }}
      />
    );
  }

  if (!dense && (actions.accept || actions.reject)) {
    slots.actions = (
      <>
        {actions.accept?.label && (
          <SnackbarActionControl
            role="accept"
            action={actions.accept}
            snackbarColor={snackbarColor}
            layout="inline"
            onRun={() => {
              actions.accept?.onClick?.();
              close();
            }}
          />
        )}

        {actions.reject?.label && (
          <SnackbarActionControl
            role="reject"
            action={actions.reject}
            snackbarColor={snackbarColor}
            layout="inline"
            onRun={() => {
              actions.reject?.onClick?.();
              close();
            }}
          />
        )}
      </>
    );
  }

  return Object.keys(slots).length > 0 ? slots : undefined;
}
