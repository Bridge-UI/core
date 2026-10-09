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

  const Root = merged.as;

  return <Root {...rootBind}>{children}</Root>;
}

export default Text;
