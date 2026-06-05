// ** External Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import type {
  BridgeSnackbarContentProps,
  SnackbarAction,
} from "@/Actions/Snackbar/bridgeSnackbar.types";
import type { SnackbarSlots } from "@/Components/Snackbar/snackbar.types";

function runAction(action: SnackbarAction | undefined, close: () => void) {
  action?.onClick?.();
  close();
}

export function resolveBridgeSnackbarSlots(
  props: Pick<BridgeSnackbarContentProps, "actions" | "rightButtons" | "dense">,
  close: () => void,
): SnackbarSlots | undefined {
  const { actions, rightButtons, dense } = props;

  if (!actions?.accept && !actions?.reject) {
    return undefined;
  }

  const slots: SnackbarSlots = {};

  if (rightButtons) {
    slots.right = (
      <div className="flex flex-col border-l border-dark-200 dark:border-dark-700">
        {actions.accept?.label && (
          <div
            className={cn("flex flex-1 h-0", {
              "border-b border-dark-200 dark:border-dark-700": actions.reject,
            })}
          >
            <button
              type="button"
              className={cn(
                "cursor-pointer flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-none rounded-tr-lg focus:outline-hidden",
                !actions.accept.className &&
                  "text-primary-600 hover:text-primary-500 hover:bg-dark-50 dark:hover:bg-dark-700",
                actions.accept.className,
                !actions.reject && "rounded-br-lg",
              )}
              onClick={() => runAction(actions.accept, close)}
            >
              {actions.accept.label}
            </button>
          </div>
        )}

        {actions.reject?.label && (
          <div className="flex flex-1 h-0">
            <button
              type="button"
              className={cn(
                "cursor-pointer flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-none rounded-br-lg focus:outline-hidden",
                !actions.reject.className &&
                  "text-dark-700 hover:text-dark-500 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-700",
                actions.reject.className,
                !actions.accept && "rounded-tr-lg",
              )}
              onClick={() => runAction(actions.reject, close)}
            >
              {actions.reject.label}
            </button>
          </div>
        )}
      </div>
    );

    return slots;
  }

  if (dense && actions.accept?.label) {
    slots.trailing = (
      <button
        type="button"
        className={cn(
          "cursor-pointer mr-4 text-sm font-medium rounded-md shrink-0 focus:outline-hidden",
          !actions.accept.className &&
            "text-primary-600 hover:text-primary-500 dark:text-primary-400",
          actions.accept.className,
        )}
        onClick={() => runAction(actions.accept, close)}
      >
        {actions.accept.label}
      </button>
    );
  }

  if (!dense && (actions.accept || actions.reject)) {
    slots.actions = (
      <>
        {actions.accept?.label && (
          <button
            type="button"
            className={cn(
              "cursor-pointer text-sm font-medium rounded-md focus:outline-hidden",
              !actions.accept.className &&
                "text-primary-600 hover:text-primary-500 dark:text-primary-400",
              actions.accept.className,
              actions.accept.solid && "px-3 py-2 border shadow-xs",
            )}
            onClick={() => runAction(actions.accept, close)}
          >
            {actions.accept.label}
          </button>
        )}

        {actions.reject?.label && (
          <button
            type="button"
            className={cn(
              "cursor-pointer text-sm font-medium rounded-md focus:outline-hidden",
              !actions.reject.className &&
                "text-dark-700 hover:text-dark-500 dark:text-dark-400",
              actions.reject.className,
              actions.reject.solid &&
                "px-3 py-2 border border-dark-300 shadow-xs",
            )}
            onClick={() => runAction(actions.reject, close)}
          >
            {actions.reject.label}
          </button>
        )}
      </>
    );
  }

  return Object.keys(slots).length > 0 ? slots : undefined;
}
