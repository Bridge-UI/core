// ** External Imports
import { X } from "lucide-react";
import { createPortal } from "react-dom";

// ** Core Imports
import { cn, resolveModalPortalElement } from "@bridge-ui/core";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useSnackbar } from "@/Components/Snackbar/hooks/useSnackbar";
import type { SnackbarProps } from "@/Components/Snackbar/snackbar.types";
import { hasSlotOrProp, resolveSlotOrProp } from "@/Utils";

const snackbarLibDefaults = {
  color: "primary",
  duration: 5000,
  transition: "slide",
  closeButton: true,
  progressbar: true,
  teleportTo: "body",
} as const;

function SnackbarShell({
  show,
  merged,
  slots,
  children,
  rootBind,
  iconBind,
  titleBind,
  progressBind,
  resolvedIcon,
  descriptionBind,
  requestClose,
}: ReturnType<typeof useSnackbar> & { show: boolean }) {
  const hasIcon = Boolean(slots?.icon || resolvedIcon || merged.img);
  const hasTitle = hasSlotOrProp(slots, "title", merged.title);
  const hasDescription = hasSlotOrProp(
    slots,
    "description",
    merged.description,
  );
  const hasRight = Boolean(slots?.right);

  return (
    <div
      {...rootBind}
      className={cn(rootBind.className, {
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
                className="cursor-pointer inline-flex rounded-md text-dark-400 hover:text-dark-500 focus:outline-hidden"
                onClick={requestClose}
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
  show = false,
  onClose,
  onShowChange,
  stackId,
  ...ownProps
}: SnackbarProps) {
  const snackbarState = useSnackbar(
    { ...ownProps, show, onClose, onShowChange, stackId },
    snackbarLibDefaults,
    { show, onClose, stackId, onShowChange },
  );

  if (!snackbarState.rendered) {
    return null;
  }

  const shell = <SnackbarShell {...snackbarState} show={show} />;

  const { teleportTo } = snackbarState.merged;

  if (teleportTo === false) {
    return shell;
  }

  if (typeof document === "undefined") {
    return null;
  }

  const portalElement = resolveModalPortalElement(teleportTo);

  if (portalElement === null) {
    return shell;
  }

  return createPortal(shell, portalElement);
}

export default Snackbar;
