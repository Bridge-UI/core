// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { List } from "@/Components/List";
import { useSidebarList } from "@/Components/Sidebar/hooks/useSidebarList";
import type { SidebarListProps } from "@/Components/Sidebar/sidebar.types";

function SidebarList({
  nested,
  classes,
  iconOnly: iconOnlyProp,
  ...props
}: SidebarListProps) {
  const { iconOnly, rootClassName } = useSidebarList({
    nested,
    iconOnly: iconOnlyProp,
  });

  return (
    <List
      {...props}
      nested={nested}
      iconOnly={iconOnly}
      classes={{
        ...classes,
        root: cn(rootClassName, classes?.root),
      }}
    />
  );
}

export default SidebarList;
