// ** Local Imports
import type { HeadingProps } from "@/Components/Heading";
import { useHeading } from "@/Components/Heading";

function Heading(props: HeadingProps) {
  const { rootTag, children, rootBind } = useHeading(props, {
    level: 2,
    color: "dark",
    weight: "semibold",
    variant: "default",
  });

  const Root = rootTag;

  return <Root {...rootBind}>{children}</Root>;
}

export default Heading;
