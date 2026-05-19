// ** External Imports
import { get } from "es-toolkit/compat";
import { computed } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";
import { sizeProps } from "@bridge-ui/core/Components/Icon";

// ** Local Imports
import type { IconOwnProps, IconProps } from "@/Components/Icon/icon.types";
import { splitComponentProps, useBridgeUIComponent } from "@/Utils";

const iconBridgeKeys = [
  "icon",
  "size",
] as const satisfies readonly (keyof IconOwnProps)[];

export function useIcon(
  props: IconProps,
  attrs: Record<string, unknown>,
  libDefaults: Partial<IconOwnProps>,
) {
  const { userClass, propsForMerge, rootBind } = splitComponentProps(
    props,
    attrs,
    { bridgeKeys: iconBridgeKeys },
  );

  const { entry: bridgeIcon, merged } = useBridgeUIComponent({
    libDefaults,
    props: propsForMerge,
    componentName: "Icon",
  });

  const mergedClass = computed(() => {
    return cn(get(sizeProps, merged.value.size ?? "md"), userClass);
  });

  return {
    merged,
    rootBind,
    bridgeIcon,
    mergedClass,
  };
}
