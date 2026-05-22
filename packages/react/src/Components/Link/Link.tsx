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

  return (
    <a
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
            <Icon icon={merged.leftIcon} size={merged.size} {...leftIconBind} />
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
              icon={merged.rightIcon}
              size={merged.size}
              {...rightIconBind}
            />
          ) : null}
        </Fragment>
      )}
    </a>
  );
}

export default Link;
