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
    iconBind,
    iconSize,
    isAnchor,
    isButton,
    showIcon,
    rootClass,
    isDisabled,
    showDefault,
    showSpinner,
    spinnerIcon,
    rootHtmlProps,
    loadingIconBind,
  } = useMiniButton(props, {
    size: "md",
    as: "button",
    rounded: "md",
    variant: "flat",
    color: "primary",
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
