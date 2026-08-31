// ** Local Imports
import { Button } from "@/Components/Button";
import { useSidebarTrigger } from "@/Components/Sidebar/hooks/useSidebarTrigger";
import type { SidebarTriggerProps } from "@/Components/Sidebar/sidebar.types";

function SidebarTrigger(props: SidebarTriggerProps) {
  const { side, panelId, children, expanded, handleClick, rootInheritedAttrs } =
    useSidebarTrigger(props);

  return (
    <Button
      {...rootInheritedAttrs}
      color="dark"
      type="button"
      density="mini"
      variant="light"
      onClick={handleClick}
      aria-expanded={expanded}
      aria-controls={panelId || undefined}
      icon={children ? undefined : "panelLeft"}
      aria-label={props["aria-label"] ?? "Toggle sidebar"}
      classes={{
        icon: side === "right" ? "rotate-180 rtl:rotate-0" : "rtl:rotate-180",
      }}
    >
      {children}
    </Button>
  );
}

export default SidebarTrigger;
