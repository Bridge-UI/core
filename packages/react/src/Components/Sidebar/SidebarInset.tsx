// ** Local Imports
import { useSidebarInset } from "@/Components/Sidebar/hooks/useSidebarInset";
import type { SidebarInsetProps } from "@/Components/Sidebar/sidebar.types";

function SidebarInset(props: SidebarInsetProps) {
  const { children, rootBind } = useSidebarInset(props);

  return <main {...rootBind}>{children}</main>;
}

export default SidebarInset;
