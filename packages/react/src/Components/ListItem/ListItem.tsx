// ** External Imports
import { createElement } from "react";

// ** Local Imports
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

      {hasEnd ? <div {...endBind}>{slots?.end}</div> : null}
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
