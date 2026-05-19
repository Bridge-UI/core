// ** Local Imports
import { Icon } from "@/Components/Icon";
import type { LinkProps } from "@/Components/Link";
import { useLink } from "@/Components/Link";

function Link(props: LinkProps) {
  const {
    slots,
    merged,
    children,
    iconSize,
    rootClass,
    isDisabled,
    showAppend,
    hasChildren,
    showPrepend,
    leftIconBind,
    showLeftIcon,
    rightIconBind,
    rootHtmlProps,
    showRightIcon,
  } = useLink(props, {
    size: "md",
    color: "primary",
    underline: "hover",
  });

  return (
    <a
      {...rootHtmlProps}
      className={rootClass}
      href={isDisabled ? undefined : merged.href}
      aria-disabled={isDisabled ? true : undefined}
      target={merged.external && !isDisabled ? "_blank" : undefined}
      rel={merged.external && !isDisabled ? "noopener noreferrer" : undefined}
    >
      {showPrepend && slots?.prepend}

      {showLeftIcon && merged.leftIcon && (
        <Icon icon={merged.leftIcon} size={iconSize} {...leftIconBind} />
      )}

      {hasChildren && children}

      {showRightIcon && merged.rightIcon && (
        <Icon icon={merged.rightIcon} size={iconSize} {...rightIconBind} />
      )}

      {showAppend && slots?.append}
    </a>
  );
}

export default Link;
