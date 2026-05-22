// ** External Imports
import { createElement } from "react";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";
import { useIcon } from "@/Components/Icon";

function Icon(props: IconProps) {
  const { merged, rootBind } = useIcon(props, { size: "md" });

  return createElement(merged.icon, rootBind);
}

export default Icon;
