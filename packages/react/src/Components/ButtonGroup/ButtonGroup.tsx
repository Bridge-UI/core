// ** Local Imports
import { ButtonGroupContext } from "@/Components/ButtonGroup/ButtonGroupContext";
import type { ButtonGroupProps } from "@/Components/ButtonGroup/buttonGroup.types";
import { useButtonGroup } from "@/Components/ButtonGroup/hooks/useButtonGroup";

const buttonGroupLibDefaults = {
  full: false,
  color: "primary",
  variant: "solid",
  separator: true,
  orientation: "horizontal",
} as const;

function ButtonGroup(props: ButtonGroupProps) {
  const { children, rootBind, contextValue } = useButtonGroup(
    props,
    buttonGroupLibDefaults,
  );

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <div {...rootBind}>{children}</div>
    </ButtonGroupContext.Provider>
  );
}

export default ButtonGroup;
