// ** Local Imports
import type { ButtonGroupProps } from "@/Components/ButtonGroup/buttonGroup.types";
import { useButtonGroup } from "@/Components/ButtonGroup/hooks/useButtonGroup";

const buttonGroupLibDefaults = {
  full: false,
  orientation: "horizontal",
} as const;

function ButtonGroup(props: ButtonGroupProps) {
  const { children, rootBind } = useButtonGroup(props, buttonGroupLibDefaults);

  return <div {...rootBind}>{children}</div>;
}

export default ButtonGroup;
