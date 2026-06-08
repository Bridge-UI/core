// ** External Imports
import { X } from "lucide-react";
import { createPortal } from "react-dom";

// ** Core Imports
import { cn, hasDocument, resolveModalPortalElement } from "@bridge-ui/core";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useSnackbar } from "@/Components/Snackbar/hooks/useSnackbar";
import type { SnackbarProps } from "@/Components/Snackbar/snackbar.types";
import { hasSlotOrProp, resolveSlotOrProp } from "@/Utils";

const snackbarLibDefaults = {
  duration: 5000,
  color: "primary",
  closeButton: true,
  progressbar: true,
  teleportTo: "body",
  transition: "slide",
  position: "bottom-center",
} as const;

function SnackbarPanel({
  show,
  slots,
  merged,
  children,
  iconBind,
  panelBind,
  titleBind,
  progressBind,
  resolvedIcon,
  requestClose,
  descriptionBind,
}: ReturnType<typeof useSnackbar> & { show: boolean }) {
  const hasRight = Boolean(slots?.right);

  const hasTitle = hasSlotOrProp(slots, "title", merged.title);

  const hasIcon = Boolean(slots?.icon || resolvedIcon || merged.img);

  const hasDescription = hasSlotOrProp(
    slots,
    "description",
    merged.description,
  );

  return (
    <div
      {...panelBind}
      className={cn(panelBind.className, {
        flex: hasRight,
      })}
    >
      {show && merged.duration !== false && merged.progressbar !== false && (
        <div {...progressBind} />
      )}

      <div
        className={cn({
          "pl-4": merged.dense,
          "p-4": !hasRight,
          "w-0 flex-1 flex items-center p-4": hasRight,
        })}
      >
        <div
          className={cn({
            "flex items-start": !hasRight,
            "w-full flex": hasRight,
          })}
        >
          {hasIcon && (
            <div
              className={cn("shrink-0", {
                "w-6": Boolean(resolvedIcon || slots?.icon),
                "pt-0.5": Boolean(merged.img),
              })}
            >
              {slots?.icon}

              {!slots?.icon && merged.img && (
                <img
                  alt=""
                  src={merged.img}
                  className="w-10 h-10 rounded-full"
                />
              )}

              {!slots?.icon && !merged.img && resolvedIcon != null && (
                <Icon icon={resolvedIcon} {...iconBind} />
              )}
            </div>
          )}

          <div
            className={cn("w-0 flex-1 pt-0.5", {
              "ml-3": hasIcon,
            })}
          >
            {hasTitle && (
              <p {...titleBind}>
                {resolveSlotOrProp({
                  slots,
                  name: "title",
                  fallback: merged.title,
                })}
              </p>
            )}

            {hasDescription && (
              <p {...descriptionBind}>
                {resolveSlotOrProp({
                  slots,
                  name: "description",
                  fallback: merged.description,
                })}
              </p>
            )}

            {children}

            {slots?.actions && (
              <div className={cn("flex mt-3 gap-x-3", merged.classes?.actions)}>
                {slots.actions}
              </div>
            )}
          </div>

          <div className="flex ml-4 shrink-0">
            {slots?.trailing}

            {merged.closeButton !== false && (
              <button
                type="button"
                aria-label="Close"
                onClick={requestClose}
                className="cursor-pointer inline-flex rounded-md text-dark-400 hover:text-dark-500 focus:outline-hidden"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {slots?.right}
    </div>
  );
}

function Snackbar({
  onClose,
  stackId,
  onShowChange,
  show = false,
  ...ownProps
}: SnackbarProps) {
  const snackbarState = useSnackbar(
    { ...ownProps, show, onClose, stackId, onShowChange },
    snackbarLibDefaults,
    { show, onClose, stackId, onShowChange },
  );

  if (!snackbarState.rendered) {
    return null;
  }

  const panel = <SnackbarPanel {...snackbarState} show={show} />;

  if (!snackbarState.isPortaled) {
    return panel;
  }

  const shell = (
    <div {...snackbarState.portalBind}>
      <div className="w-full max-w-sm pointer-events-auto">{panel}</div>
    </div>
  );

  const { teleportTo } = snackbarState.merged;

  if (!hasDocument()) {
    return null;
  }

  const portalElement = resolveModalPortalElement(teleportTo);

  if (portalElement === null) {
    return shell;
  }

  return createPortal(shell, portalElement);
}

export default Snackbar;
