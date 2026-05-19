// ** External Imports
import { createElement, Fragment } from "react";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import type { MiniButtonProps } from "@/Components/MiniButton";
import { useMiniButton } from "@/Components/MiniButton";

function MiniButton(props: MiniButtonProps) {
  const {
    tag,
    merged,
    children,
    iconSize,
    isAnchor,
    isButton,
    rootClass,
    showIcon,
    showDefault,
    iconBind,
    isDisabled,
    showSpinner,
    rootHtmlProps,
    loadingIconBind,
    spinnerIcon,
  } = useMiniButton(props, {
    as: "button",
    size: "md",
    rounded: "none",
    color: "primary",
    variant: "flat",
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
        <Icon icon={SpinnerIcon} size={iconSize} {...loadingIconBind} />
      )}

      {!showSpinner && (
        <Fragment>
          {showDefault && children}

          {showIcon && merged.icon && (
            <Icon icon={merged.icon} size={iconSize} {...iconBind} />
          )}
        </Fragment>
      )}
    </Fragment>,
  );
}

export default MiniButton;
