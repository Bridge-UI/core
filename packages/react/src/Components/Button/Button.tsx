// ** External Imports
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
    contentBind,
    endSlotBind,
    rootAriaBusy,
    rootDisabled,
    startIconBind,
    startSlotBind,
    loadingIconBind,
    loadingWrapBind,
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
        <span {...loadingWrapBind}>
          <Icon icon="loader" size={merged.size} {...loadingIconBind} />
        </span>
      )}

      <span {...contentBind}>
        {isMini && (
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

        {!isMini && (
          <Fragment>
            {merged.startIcon ? (
              <Icon
                size={merged.size}
                icon={merged.startIcon}
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
              <Icon size={merged.size} icon={merged.endIcon} {...endIconBind} />
            ) : (
              <Fragment>
                {hasNamedSlot(slots, "end") && (
                  <div {...endSlotBind}>{slots?.end}</div>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </span>
    </Fragment>,
  );
}

export default Button;
