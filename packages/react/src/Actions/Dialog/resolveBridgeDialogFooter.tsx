// ** External Imports
import type { ReactNode } from "react";

// ** Local Imports
import type { ResolveBridgeDialogFooterOptions } from "@/Actions/Dialog/bridgeDialog.types";
import { SnackbarActionControl } from "@/Actions/Snackbar/SnackbarActionControl";

export function resolveBridgeDialogFooter({
  acceptColor,
  actions,
  dismiss,
}: ResolveBridgeDialogFooterOptions): ReactNode | undefined {
  if (!actions?.accept && !actions?.reject) {
    return undefined;
  }

  return (
    <div className="flex justify-end gap-2">
      {actions.reject?.label && (
        <SnackbarActionControl
          role="reject"
          layout="inline"
          action={actions.reject}
          snackbarColor={acceptColor}
          onRun={() => {
            actions.reject?.onClick?.();
            dismiss();
          }}
        />
      )}

      {actions.accept?.label && (
        <SnackbarActionControl
          role="accept"
          layout="inline"
          action={actions.accept}
          snackbarColor={acceptColor}
          onRun={() => {
            actions.accept?.onClick?.();
            dismiss();
          }}
        />
      )}
    </div>
  );
}
