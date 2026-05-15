// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { LinkProps } from "@/Components/Link/link.types";
import { useBridgeUIComponent } from "@/Utils";

export function useLink(props: LinkProps, libDefaults: Partial<LinkProps>) {
  const slots = useSlots();

  const { entry: bridgeLink, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "Link",
  });

  return {
    slots,
    merged,
    bridgeLink,
  };
}
