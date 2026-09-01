// ** External Imports
import { createElement } from "react";

// ** Local Imports
import type { ButtonGroupTextProps } from "@/Components/ButtonGroup/buttonGroup.types";
import { useButtonGroupText } from "@/Components/ButtonGroup/hooks/useButtonGroupText";

function ButtonGroupText(props: ButtonGroupTextProps) {
  const { tag, children, rootBind } = useButtonGroupText(props, {
    as: "span",
  });

  return createElement(tag, rootBind, children);
}

export default ButtonGroupText;
