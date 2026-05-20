// ** Local Imports
import type { MiniBadgeProps } from "@/Components/MiniBadge";
import { useMiniBadge } from "@/Components/MiniBadge";

function MiniBadge(props: MiniBadgeProps) {
  const { children, rootClass, rootHtmlProps } = useMiniBadge(props, {
    size: "sm",
    rounded: "md",
    variant: "flat",
    color: "primary",
  });

  return (
    <span {...rootHtmlProps} className={rootClass}>
      {children}
    </span>
  );
}

export default MiniBadge;
