// ** External Imports
import { Loader2 } from "lucide-react";
import { createElement, Fragment } from "react";

// ** Local Imports
import type { ButtonProps } from "@/Components/Button";
import { useButton } from "@/Components/Button";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot, isPropPresent } from "@/Utils";

function Button(props: ButtonProps) {
  const {
    tag,
    slots,
    merged,
    isMini,
    children,
    iconBind,
    rootBind,
    rootHref,
    rootType,
    endIconBind,
    endSlotBind,
    rootAriaBusy,
    rootDisabled,
    startIconBind,
    startSlotBind,
    loadingIconBind,
    rootAriaDisabled,
  } = useButton(props, {
    size: "md",
    as: "button",
    rounded: "md",
    color: "primary",
    variant: "solid",
    density: "default",
  });

  return createElement(
    tag,
    {
      ...rootBind,
      type: rootType,
      href: rootHref,
      disabled: rootDisabled,
      "aria-busy": rootAriaBusy,
      "aria-disabled": rootAriaDisabled,
    },
    <Fragment>
      {merged.loading && (
        <Icon icon={Loader2} size={merged.size} {...loadingIconBind} />
      )}

      {!merged.loading && isMini && (
        <Fragment>
          {children ? (
            children
          ) : (
            <Fragment>
              {merged.icon && (
                <Icon icon={merged.icon} size={merged.size} {...iconBind} />
              )}
            </Fragment>
          )}
        </Fragment>
      )}

      {!merged.loading && !isMini && (
        <Fragment>
          {merged.startIcon ? (
            <Icon
              icon={merged.startIcon}
              size={merged.size}
              {...startIconBind}
            />
          ) : (
            <Fragment>
              {hasNamedSlot(slots, "start") && (
                <div {...startSlotBind}>{slots?.start}</div>
              )}
            </Fragment>
          )}

          {isPropPresent(merged.text) ? merged.text : children}

          {merged.endIcon ? (
            <Icon icon={merged.endIcon} size={merged.size} {...endIconBind} />
          ) : (
            <Fragment>
              {hasNamedSlot(slots, "end") && (
                <div {...endSlotBind}>{slots?.end}</div>
              )}
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>,
  );
}

export default Button;
