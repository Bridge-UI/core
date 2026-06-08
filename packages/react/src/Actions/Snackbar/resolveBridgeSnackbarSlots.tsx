// ** Core Imports
import { usesTrailingSnackbarActions } from "@bridge-ui/core";

// ** Local Imports
import type {
  BridgeSnackbarContentProps,
  SnackbarActionColor,
} from "@/Actions/Snackbar/bridgeSnackbar.types";
import { SnackbarActionControl } from "@/Actions/Snackbar/SnackbarActionControl";
import type { SnackbarSlots } from "@/Components/Snackbar/snackbar.types";

export function resolveBridgeSnackbarSlots(
  props: Pick<
    BridgeSnackbarContentProps,
    "actions" | "rightButtons" | "padding" | "color"
  >,
  close: () => void,
): SnackbarSlots | undefined {
  const {
    actions,
    rightButtons,
    color = "primary",
    padding = "medium",
  } = props;

  const trailingActions = usesTrailingSnackbarActions(padding);

  if (!actions?.accept && !actions?.reject) {
    return undefined;
  }

  const snackbarColor = color as SnackbarActionColor;
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
              layout="right-accept"
              action={actions.accept}
              snackbarColor={snackbarColor}
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
              layout="right-reject"
              action={actions.reject}
              snackbarColor={snackbarColor}
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

  if (trailingActions && actions.accept?.label) {
    slots.trailing = (
      <SnackbarActionControl
        role="accept"
        layout="trailing"
        action={actions.accept}
        snackbarColor={snackbarColor}
        onRun={() => {
          actions.accept?.onClick?.();
          close();
        }}
      />
    );
  }

  if (!trailingActions && (actions.accept || actions.reject)) {
    slots.actions = (
      <>
        {actions.accept?.label && (
          <SnackbarActionControl
            role="accept"
            layout="inline"
            action={actions.accept}
            snackbarColor={snackbarColor}
            onRun={() => {
              actions.accept?.onClick?.();
              close();
            }}
          />
        )}

        {actions.reject?.label && (
          <SnackbarActionControl
            role="reject"
            layout="inline"
            action={actions.reject}
            snackbarColor={snackbarColor}
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
