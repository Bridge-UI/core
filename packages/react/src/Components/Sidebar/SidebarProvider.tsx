// ** Local Imports
import { useSidebarProvider } from "@/Components/Sidebar/hooks/useSidebarProvider";
import type { SidebarProviderProps } from "@/Components/Sidebar/sidebar.types";
import { SidebarContext } from "@/Components/Sidebar/SidebarContext";

const sidebarProviderLibDefaults = {
  defaultOpen: true,
} as const;

function SidebarProvider(props: SidebarProviderProps) {
  const { children, rootBind, contextValue } = useSidebarProvider(
    props,
    sidebarProviderLibDefaults,
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div {...rootBind}>{children}</div>
    </SidebarContext.Provider>
  );
}

export default SidebarProvider;
