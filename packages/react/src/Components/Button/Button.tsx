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
    showEndIcon,
    showEndSlot,
    showSpinner,
    spinnerIcon,
    endIconClass,
    showChildren,
    showStartIcon,
    showStartSlot,
    startIconClass,
    spinnerIconClass,
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
      className: rootClass,
      type: isButton ? "button" : undefined,
      disabled: isButton ? isDisabled : undefined,
      "aria-busy": merged.loading ? true : undefined,
      "aria-disabled": isDisabled && !isButton ? true : undefined,
      href: isAnchor && !isDisabled && merged.href ? merged.href : undefined,
    },
    <Fragment>
      {showSpinner && (
        <Icon
          icon={SpinnerIcon}
          size={merged.size}
          className={spinnerIconClass}
        />
      )}

      {!showSpinner && (
        <Fragment>
          {showStartIcon && merged.startIcon && (
            <Icon
              size={merged.size}
              icon={merged.startIcon}
              className={startIconClass}
            />
          )}

          {showStartSlot && (
            <div className="inline-flex shrink-0 items-center">
              {slots?.start}
            </div>
          )}

          {showText && merged.text}

          {showChildren && props.children}

          {showEndIcon && merged.endIcon && (
            <Icon
              size={merged.size}
              icon={merged.endIcon}
              className={endIconClass}
            />
          )}

          {showEndSlot && (
            <div className="inline-flex shrink-0 items-center">
              {slots?.end}
            </div>
          )}
        </Fragment>
      )}
    </Fragment>,
  );
}

export default Button;
