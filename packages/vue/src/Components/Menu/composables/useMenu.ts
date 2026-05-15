// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { MenuProps } from "@/Components/Menu/menu.types";
import { useBridgeUIComponent } from "@/Utils";

export function useMenu(props: MenuProps, libDefaults: Partial<MenuProps>) {
  const slots = useSlots();

  const { entry: bridgeMenu, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "Menu",
  });

  return {
    slots,
    merged,
    bridgeMenu,
  };
}
