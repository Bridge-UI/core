// ** External Imports
import { Fragment } from "react";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useTab } from "@/Components/Tab/hooks/useTab";
import type { TabProps } from "@/Components/Tab/tab.types";
import { hasNamedSlot } from "@/Utils";

function Tab(props: TabProps) {
  const {
    slots,
    merged,
    children,
    iconSize,
    rootBind,
    endIconBind,
    endSlotBind,
    startIconBind,
    startSlotBind,
  } = useTab(props);

  return (
    <button {...rootBind}>
      {merged.startIcon ? (
        <Icon size={iconSize} icon={merged.startIcon} {...startIconBind} />
      ) : (
        <Fragment>
          {hasNamedSlot(slots, "start") && (
            <div {...startSlotBind}>{slots?.start}</div>
          )}
        </Fragment>
      )}

      {children}

      {merged.endIcon ? (
        <Icon size={iconSize} icon={merged.endIcon} {...endIconBind} />
      ) : (
        <Fragment>
          {hasNamedSlot(slots, "end") && (
            <div {...endSlotBind}>{slots?.end}</div>
          )}
        </Fragment>
      )}
    </button>
  );
}

export default Tab;
