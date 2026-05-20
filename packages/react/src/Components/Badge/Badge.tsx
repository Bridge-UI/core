// ** Local Imports
import type { BadgeProps } from "@/Components/Badge";
import { useBadge } from "@/Components/Badge";

function Badge(props: BadgeProps) {
  const { children, rootClass, rootHtmlProps } = useBadge(props, {
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

export default Badge;
