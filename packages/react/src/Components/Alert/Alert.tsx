// ** External Imports
import { Fragment } from "react";

// ** Local Imports
import type { AlertProps } from "@/Components/Alert";
import { useAlert } from "@/Components/Alert";
import { Icon } from "@/Components/Icon";
import { hasSlotOrProp, resolveSlotOrProp } from "@/Utils";

function Alert(props: AlertProps) {
  const {
    slots,
    merged,
    bodyBind,
    children,
    iconBind,
    rootBind,
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

      {!slots?.header && hasSlotOrProp(slots, "title", merged.title) && (
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
              {resolveSlotOrProp({
                slots,
                name: "title",
                fallback: merged.title,
              })}
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
