// ** External Imports
import { get } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { sizeProps } from "@bridge-ui/core/Components/Icon";

// ** Local Imports
import type { IconOwnProps, IconProps } from "@/Components/Icon/icon.types";
import { derived, mergePartBind, useBridgeUIComponent } from "@/Utils";

const iconBridgeKeys = [
  "icon",
  "size",
] as const satisfies readonly (keyof IconOwnProps)[];

type IconLibDefaults = LibDefaultsShape<IconOwnProps, "size">;

type IconMerged = MergeLibDefaults<IconOwnProps, IconLibDefaults>;

export function useIcon(props: IconProps, libDefaults: IconLibDefaults) {
  // Setup
  const { customProps, inheritedAttrs } = splitComponentProps<
    IconProps,
    typeof iconBridgeKeys
  >({
    props,
    bridgeKeys: iconBridgeKeys,
  });

  const { entry: bridgeIcon, merged } = useBridgeUIComponent<
    IconMerged,
    "Icon"
  >({
    libDefaults,
    props: customProps,
    componentName: "Icon",
  });

  // Classes
  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeIcon?.customProps?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeIcon?.customProps?.size]);

  // Binds
  const rootBind = derived(() => {
    return mergePartBind(
      {},
      inheritedAttrs,
      cn({
        [sizeClass ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    rootBind,
  };
}
