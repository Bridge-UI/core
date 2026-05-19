// ** Local Imports
import type { MiniBadgeProps } from "@/Components/MiniBadge";
import { useMiniBadge } from "@/Components/MiniBadge";

function MiniBadge(props: MiniBadgeProps) {
  const { children, rootClass, rootHtmlProps } = useMiniBadge(props, {
    size: "xs",
    color: "primary",
    rounded: "full",
    variant: "flat",
  });

  return (
    <span {...rootHtmlProps} className={rootClass}>
      {children}
    </span>
  );
}

export default MiniBadge;
