// ** Local Imports
import type { BadgeProps } from "@/Components/Badge";
import { useBadge } from "@/Components/Badge";

function Badge(props: BadgeProps) {
  const { children, rootClass, rootHtmlProps } = useBadge(props, {
    size: "sm",
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

export default Badge;
