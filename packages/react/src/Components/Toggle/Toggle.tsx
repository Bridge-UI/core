// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useToggle } from "@/Components/Toggle/hooks/useToggle";
import type { ToggleProps } from "@/Components/Toggle/toggle.types";

function Toggle(props: ToggleProps) {
  const { merged, children, iconSize, rootBind, startIconBind } =
    useToggle(props);

  return (
    <button {...rootBind}>
      {merged.startIcon ? (
        <Icon size={iconSize} icon={merged.startIcon} {...startIconBind} />
      ) : null}

      {children}
    </button>
  );
}

export default Toggle;
