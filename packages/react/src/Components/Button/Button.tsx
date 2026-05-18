// ** External Imports
import { createElement, Fragment } from "react";

// ** Local Imports
import type { ButtonProps } from "@/Components/Button/button.types";
import { useButton } from "@/Components/Button/hooks/useButton";
import { Icon } from "@/Components/Icon";

function Button(props: ButtonProps) {
  const { children, slots, ...rest } = props;

  const {
    tag,
    merged,
    isAnchor,
    isButton,
    rootClass,
    isDisabled,
    showEndIcon,
    showEndSlot,
    showSpinner,
    spinnerIcon,
    endIconClass,
    showStartIcon,
    showStartSlot,
    startIconClass,
    spinnerIconClass,
  } = useButton(
    rest,
    {
      size: "md",
      as: "button",
      rounded: "sm",
      color: "primary",
      variant: "solid",
    },
    { slots },
  );

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
      {showStartIcon && merged.startIcon && (
        <Icon
          size={merged.size}
          icon={merged.startIcon}
          className={startIconClass}
        />
      )}

      {showStartSlot && (
        <div className="inline-flex shrink-0 items-center">{slots?.start}</div>
      )}

      {children}

      {showEndIcon && merged.endIcon && (
        <Icon
          size={merged.size}
          icon={merged.endIcon}
          className={endIconClass}
        />
      )}

      {showEndSlot && (
        <div className="inline-flex shrink-0 items-center">{slots?.end}</div>
      )}

      {showSpinner && (
        <Icon
          icon={SpinnerIcon}
          size={merged.size}
          className={spinnerIconClass}
        />
      )}
    </Fragment>,
  );
}

export default Button;
