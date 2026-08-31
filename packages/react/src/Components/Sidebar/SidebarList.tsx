// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { List } from "@/Components/List";
import { ListSectionContext } from "@/Components/ListSection/ListSectionContext";
import { useSidebarList } from "@/Components/Sidebar/hooks/useSidebarList";
import type { SidebarListProps } from "@/Components/Sidebar/sidebar.types";
import { SidebarListContext } from "@/Components/Sidebar/SidebarListContext";

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
    <SidebarListContext.Provider value={{ iconOnly }}>
      <ListSectionContext.Provider value={{ hidden: iconOnly }}>
        <List
          {...props}
          nested={nested}
          hidden={nested === true && iconOnly ? true : undefined}
          classes={{
            ...classes,
            root: cn(rootClassName, classes?.root),
          }}
        />
      </ListSectionContext.Provider>
    </SidebarListContext.Provider>
  );
}

export default SidebarList;
