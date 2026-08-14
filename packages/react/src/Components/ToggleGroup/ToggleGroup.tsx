// ** Local Imports
import { ToggleGroupContext } from "@/Components/ToggleGroup/ToggleGroupContext";
import { useToggleGroup } from "@/Components/ToggleGroup/hooks/useToggleGroup";
import type { ToggleGroupProps } from "@/Components/ToggleGroup/toggleGroup.types";

const toggleGroupLibDefaults = {
  size: "md",
  full: false,
  rounded: "full",
  disabled: false,
  variant: "solid",
  color: "primary",
  orientation: "horizontal",
} as const;

function ToggleGroup(props: ToggleGroupProps) {
  const { children, rootBind, contextValue } = useToggleGroup(
    props,
    toggleGroupLibDefaults,
  );

  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <div {...rootBind}>{children}</div>
    </ToggleGroupContext.Provider>
  );
}

export default ToggleGroup;
