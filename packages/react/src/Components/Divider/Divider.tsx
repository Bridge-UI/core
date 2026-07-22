// ** Local Imports
import type { DividerProps } from "@/Components/Divider";
import { useDivider } from "@/Components/Divider";

function Divider(props: DividerProps) {
  const { rootBind } = useDivider(props, {
    color: "dark",
    orientation: "horizontal",
  });

  return <hr {...rootBind} />;
}

export default Divider;
