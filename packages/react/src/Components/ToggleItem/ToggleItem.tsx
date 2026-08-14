// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useToggleItem } from "@/Components/ToggleItem/hooks/useToggleItem";
import type { ToggleItemProps } from "@/Components/ToggleItem/toggleItem.types";

function ToggleItem(props: ToggleItemProps) {
  const { merged, children, iconSize, rootBind, startIconBind } =
    useToggleItem(props);

  return (
    <button {...rootBind}>
      {merged.startIcon ? (
        <Icon size={iconSize} icon={merged.startIcon} {...startIconBind} />
      ) : null}

      {children}
    </button>
  );
}

export default ToggleItem;
