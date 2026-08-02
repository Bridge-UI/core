// ** External Imports
import { createElement } from "react";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";
import { useIcon } from "@/Components/Icon";

function Icon(props: IconProps) {
  const { rootBind, resolvedIcon } = useIcon(props, { size: "md" });

  if (resolvedIcon == null) {
    return null;
  }

  return createElement(resolvedIcon, rootBind);
}

export default Icon;
