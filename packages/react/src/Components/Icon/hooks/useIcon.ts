// ** External Imports
import { get } from "es-toolkit/compat";
import { useMemo } from "react";

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

export function useIcon(props: IconProps, libDefaults: Partial<IconOwnProps>) {
  const { className, propsForMerge, rootHtmlProps } = splitComponentProps(
    props,
    {
      peel: ["className"],
      bridgeKeys: iconBridgeKeys,
    },
  );

  const { entry: bridgeIcon, merged } = useBridgeUIComponent({
    libDefaults,
    props: propsForMerge,
    componentName: "Icon",
  });

  const mergedClass = useMemo(() => {
    return cn(get(sizeProps, merged.size ?? "md"), className);
  }, [className, merged.size]);

  return {
    merged,
    bridgeIcon,
    mergedClass,
    rootHtmlProps,
  };
}
