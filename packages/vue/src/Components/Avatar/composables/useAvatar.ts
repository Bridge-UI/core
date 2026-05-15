// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { AvatarProps } from "@/Components/Avatar/avatar.types";
import { useBridgeUIComponent } from "@/Utils";

export function useAvatar(
  props: AvatarProps,
  libDefaults: Partial<AvatarProps>,
) {
  const slots = useSlots();

  const { entry: bridgeAvatar, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "Avatar",
  });

  return {
    slots,
    merged,
    bridgeAvatar,
  };
}
