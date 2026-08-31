// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { ListItem } from "@/Components/ListItem";
import { useSidebarListItem } from "@/Components/Sidebar/hooks/useSidebarListItem";
import type { SidebarListItemProps } from "@/Components/Sidebar/sidebar.types";
import { Tooltip } from "@/Components/Tooltip";

function SidebarListItem({
  classes,
  customProps,
  tooltip: tooltipProp,
  tooltipPlacement: tooltipPlacementProp,
  ...props
}: SidebarListItemProps) {
  const { tooltip, itemClasses, accessibleName, tooltipPlacement } =
    useSidebarListItem({
      tooltip: tooltipProp,
      primary: props.primary,
      secondary: props.secondary,
      tooltipPlacement: tooltipPlacementProp,
    });

  const item = (
    <ListItem
      {...props}
      as={tooltip ? "div" : props.as}
      customProps={{
        ...customProps,
        interactive: {
          "aria-label": accessibleName,
          ...customProps?.interactive,
        },
      }}
      classes={{
        ...classes,
        end: cn(itemClasses.end, classes?.end),
        start: cn(itemClasses.start, classes?.start),
        content: cn(itemClasses.content, classes?.content),
        interactive: cn(itemClasses.interactive, classes?.interactive),
      }}
    />
  );

  if (!tooltip) {
    return item;
  }

  return (
    <li className="list-none">
      <Tooltip
        content={tooltip}
        slots={{ trigger: item }}
        placement={tooltipPlacement}
        classes={{
          root: "flex w-full min-w-0",
          trigger: "flex w-full min-w-0",
        }}
      />
    </li>
  );
}

export default SidebarListItem;
