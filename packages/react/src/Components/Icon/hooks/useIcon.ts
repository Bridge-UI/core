// ** External Imports
import { get } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";
import { sizeProps } from "@bridge-ui/core/Components/Icon";

// ** Local Imports
import type { IconProps } from "@/Components/Icon/icon.types";
import { useBridgeUIComponent } from "@/Utils";

export function useIcon(props: IconProps, libDefaults: Partial<IconProps>) {
  const { entry: bridgeIcon, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "Icon",
  });

  const mergedClass = useMemo(() => {
    return cn(get(sizeProps, merged.size ?? "md"), merged.className);
  }, [merged.size, merged.className]);

  return {
    merged,
    bridgeIcon,
    mergedClass,
  };
}
