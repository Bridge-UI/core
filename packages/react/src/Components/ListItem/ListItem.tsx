// ** External Imports
import { createElement } from "react";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useListItem } from "@/Components/ListItem/hooks/useListItem";
import type { ListItemProps } from "@/Components/ListItem/listItem.types";
import { hasNamedSlot } from "@/Utils";

function ListItemRow({
  slots,
  hasEnd,
  endBind,
  startBind,
  hasPrimary,
  contentBind,
  primaryBind,
  hasSecondary,
  rowClassName,
  secondaryBind,
  primaryContent,
  secondaryContent,
  selectedIconBind,
  resolvedSelectedIcon,
}: ReturnType<typeof useListItem>) {
  return (
    <div className={rowClassName}>
      {hasNamedSlot(slots, "start") ? (
        <div {...startBind}>{slots?.start}</div>
      ) : null}

      {hasPrimary || hasSecondary ? (
        <div {...contentBind}>
          {hasPrimary ? <span {...primaryBind}>{primaryContent}</span> : null}

          {hasSecondary ? (
            <span {...secondaryBind}>{secondaryContent}</span>
          ) : null}
        </div>
      ) : null}

      {hasEnd ? (
        <div {...endBind}>
          {slots?.end}

          {!slots?.end && resolvedSelectedIcon != null ? (
            <Icon icon={resolvedSelectedIcon} {...selectedIconBind} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ListItem(props: ListItemProps) {
  const listItemState = useListItem(props, {
    role: "button",
  });

  const row = <ListItemRow {...listItemState} />;
  const hit = listItemState.interactiveBind ? (
    <div {...listItemState.interactiveBind}>{row}</div>
  ) : (
    row
  );

  return createElement(
    listItemState.merged.as ?? "li",
    listItemState.rootBind,
    hit,
  );
}

export default ListItem;
