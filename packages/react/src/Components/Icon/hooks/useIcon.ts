// ** External Imports
import { get } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import { resolveIconSource } from "@bridge-ui/core/Adapters";
import { iconSizeProps as sizeProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconElement } from "@/Adapters/Icon";
import { useIconAdapter } from "@/Adapters/Icon";
import type { IconOwnProps, IconProps } from "@/Components/Icon/icon.types";
import { derived, mergePartBind, useBridgeUIComponent } from "@/Utils";

const iconBridgeKeys = [
  "icon",
  "size",
] as const satisfies readonly (keyof IconOwnProps)[];

type IconLibDefaults = LibDefaultsShape<IconOwnProps, "size">;

type IconMerged = MergeLibDefaults<IconOwnProps, IconLibDefaults>;

export function useIcon(props: IconProps, libDefaults: IconLibDefaults) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    IconProps,
    typeof iconBridgeKeys
  >({
    props,
    bridgeKeys: iconBridgeKeys,
  });

  const { merged, entry: bridgeIcon } = useBridgeUIComponent<
    IconMerged,
    "Icon"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Icon",
  });

  const iconAdapter = useIconAdapter();

  const resolvedIcon = useMemo(() => {
    return resolveIconSource<IconElement>(merged.icon, iconAdapter);
  }, [merged.icon, iconAdapter]);

  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeIcon?.tokens?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeIcon?.tokens?.size]);

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
    resolvedIcon,
  };
}
