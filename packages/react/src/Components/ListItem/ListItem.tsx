// ** External Imports
import { createElement } from "react";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useListItem } from "@/Components/ListItem/hooks/useListItem";
import type { ListItemProps } from "@/Components/ListItem/listItem.types";

function ListItemRow({
  slots,
  hasEnd,
  endBind,
  hasStart,
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
      {hasStart ? <div {...startBind}>{slots?.start}</div> : null}

      <div {...contentBind}>
        {hasPrimary ? <span {...primaryBind}>{primaryContent}</span> : null}

        {hasSecondary ? (
          <span {...secondaryBind}>{secondaryContent}</span>
        ) : null}
      </div>

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
    align: "center",
  });

  const row = <ListItemRow {...listItemState} />;

  return createElement(
    listItemState.merged.as ?? "li",
    listItemState.rootBind,
    listItemState.interactiveBind ? (
      <div {...listItemState.interactiveBind}>{row}</div>
    ) : (
      row
    ),
  );
}

export default ListItem;
