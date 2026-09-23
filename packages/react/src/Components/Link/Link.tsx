// ** External Imports
import { Fragment } from "react";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import type { LinkProps } from "@/Components/Link";
import { useLink } from "@/Components/Link";
import { hasNamedSlot } from "@/Utils";

function Link(props: LinkProps) {
  const {
    slots,
    merged,
    rootRel,
    rootTag,
    children,
    rootBind,
    rootHref,
    rootTarget,
    leftIconBind,
    rightIconBind,
    rootAriaDisabled,
  } = useLink(props, {
    size: "md",
    color: "primary",
    underline: "hover",
  });

  const Root = rootTag;

  return (
    <Root
      {...rootBind}
      rel={rootRel}
      href={rootHref}
      target={rootTarget}
      aria-disabled={rootAriaDisabled}
    >
      {hasNamedSlot(slots, "prepend") ? (
        slots?.prepend
      ) : (
        <Fragment>
          {merged.leftIcon ? (
            <Icon size={merged.size} icon={merged.leftIcon} {...leftIconBind} />
          ) : null}
        </Fragment>
      )}

      {children}

      {hasNamedSlot(slots, "append") ? (
        slots?.append
      ) : (
        <Fragment>
          {merged.rightIcon ? (
            <Icon
              size={merged.size}
              icon={merged.rightIcon}
              {...rightIconBind}
            />
          ) : null}
        </Fragment>
      )}
    </Root>
  );
}

export default Link;
