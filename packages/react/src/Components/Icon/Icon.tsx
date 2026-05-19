// ** External Imports
import { createElement } from "react";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";
import { useIcon } from "@/Components/Icon";

function Icon(props: IconProps) {
  const { merged, mergedClass, rootHtmlProps } = useIcon(props, { size: "md" });

  return createElement(merged.icon, {
    className: mergedClass,
    ...rootHtmlProps,
  });
}

export default Icon;
