// ** External Imports
import { createElement, Fragment } from "react";

// ** Local Imports
import type { BreadcrumbItemProps } from "@/Components/BreadcrumbItem/breadcrumbItem.types";
import { useBreadcrumbItem } from "@/Components/BreadcrumbItem/hooks/useBreadcrumbItem";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot } from "@/Utils";

function BreadcrumbItem(props: BreadcrumbItemProps) {
  const {
    slots,
    merged,
    crumbAs,
    children,
    rootBind,
    linkBind,
    endIconBind,
    startIconBind,
    separatorBind,
    separatorIcon,
    separatorContent,
    separatorIconBind,
  } = useBreadcrumbItem(props);

  return (
    <li {...rootBind}>
      <span {...separatorBind}>
        {separatorContent != null ? (
          separatorContent
        ) : (
          <Icon icon={separatorIcon} {...separatorIconBind} />
        )}
      </span>

      {createElement(
        crumbAs,
        linkBind,
        <Fragment>
          {hasNamedSlot(slots, "start") ? (
            slots?.start
          ) : (
            <Fragment>
              {merged.startIcon ? (
                <Icon icon={merged.startIcon} {...startIconBind} />
              ) : null}
            </Fragment>
          )}

          {children}

          {hasNamedSlot(slots, "end") ? (
            slots?.end
          ) : (
            <Fragment>
              {merged.endIcon ? (
                <Icon icon={merged.endIcon} {...endIconBind} />
              ) : null}
            </Fragment>
          )}
        </Fragment>,
      )}
    </li>
  );
}

export default BreadcrumbItem;
