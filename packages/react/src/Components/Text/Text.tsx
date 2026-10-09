// ** External Imports
import { createElement } from "react";

// ** Local Imports
import type { TextProps } from "@/Components/Text";
import { useText } from "@/Components/Text";

function Text(props: TextProps) {
  const { merged, children, rootBind } = useText(props, {
    as: "p",
    size: "md",
    color: "dark",
    weight: "normal",
    variant: "default",
  });

  return createElement(merged.as, rootBind, children);
}

export default Text;
