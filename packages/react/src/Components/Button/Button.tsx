// ** External Imports
import { createElement, Fragment } from "react";

// ** Local Imports
import type { ButtonProps } from "@/Components/Button";
import { useButton } from "@/Components/Button";
import { Icon } from "@/Components/Icon";

function Button(props: ButtonProps) {
  const {
    tag,
    slots,
    merged,
    isAnchor,
    isButton,
    showText,
    rootClass,
    isDisabled,
    endIconBind,
    endSlotBind,
    showEndIcon,
    showEndSlot,
    showSpinner,
    spinnerIcon,
    showChildren,
    rootHtmlProps,
    showStartIcon,
    showStartSlot,
    startIconBind,
    startSlotBind,
    loadingIconBind,
  } = useButton(props, {
    size: "md",
    as: "button",
    rounded: "sm",
    color: "primary",
    variant: "solid",
  });

  const SpinnerIcon = spinnerIcon;

  return createElement(
    tag,
    {
      ...rootHtmlProps,
      className: rootClass,
      type: isButton ? "button" : undefined,
      disabled: isButton ? isDisabled : undefined,
      "aria-busy": merged.loading ? true : undefined,
      "aria-disabled": isDisabled && !isButton ? true : undefined,
      href: isAnchor && !isDisabled && merged.href ? merged.href : undefined,
    },
    <Fragment>
      {showSpinner && (
        <Icon icon={SpinnerIcon} size={merged.size} {...loadingIconBind} />
      )}

      {!showSpinner && (
        <Fragment>
          {showStartIcon && merged.startIcon && (
            <Icon
              size={merged.size}
              icon={merged.startIcon}
              {...startIconBind}
            />
          )}

          {showStartSlot && <div {...startSlotBind}>{slots?.start}</div>}

          {showText && merged.text}

          {showChildren && props.children}

          {showEndIcon && merged.endIcon && (
            <Icon size={merged.size} icon={merged.endIcon} {...endIconBind} />
          )}

          {showEndSlot && <div {...endSlotBind}>{slots?.end}</div>}
        </Fragment>
      )}
    </Fragment>,
  );
}

export default Button;
