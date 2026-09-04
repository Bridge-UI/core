// ** External Imports
import { Fragment } from "react";

// ** Local Imports
import type { AlertProps } from "@/Components/Alert";
import { useAlert } from "@/Components/Alert";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot, isPropPresent } from "@/Utils";

function Alert(props: AlertProps) {
  const {
    slots,
    merged,
    bodyBind,
    children,
    iconBind,
    rootBind,
    hasTitle,
    titleBind,
    resolvedIcon,
    hasDefaultBody,
  } = useAlert(props, {
    shadow: "sm",
    rounded: "sm",
    variant: "flat",
    color: "primary",
    padding: "medium",
  });

  return (
    <div {...rootBind}>
      {slots?.header}

      {hasTitle && (
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-x-3">
            {(slots?.icon || resolvedIcon) && (
              <Fragment>
                {slots?.icon}

                {!slots?.icon && resolvedIcon != null && (
                  <Icon icon={resolvedIcon} {...iconBind} />
                )}
              </Fragment>
            )}

            <div {...titleBind}>
              {hasNamedSlot(slots, "title")
                ? slots?.title
                : isPropPresent(merged.title)
                  ? merged.title
                  : children}
            </div>
          </div>

          {slots?.action}
        </div>
      )}

      {hasDefaultBody && <div {...bodyBind}>{children}</div>}

      {slots?.footer}
    </div>
  );
}

export default Alert;
