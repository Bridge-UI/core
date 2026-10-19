// ** External Imports
import { get } from "es-toolkit/compat";

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
import { useIconAdapter, type IconElement } from "@/Adapters/Icon";
import type { IconOwnProps, IconProps } from "@/Components/Icon/icon.types";
import { mergePartBind, useBridgeUIComponent } from "@/Utils";

const iconBridgeKeys = [
  "icon",
  "size",
] as const satisfies readonly (keyof IconOwnProps)[];

type IconLibDefaults = LibDefaultsShape<IconOwnProps, "size">;

type IconMerged = MergeLibDefaults<IconOwnProps, IconLibDefaults>;

export function useIcon(props: () => IconProps, libDefaults: IconLibDefaults) {
  const split = $derived(
    splitComponentProps<IconProps, typeof iconBridgeKeys>({
      props: { ...props() },
      bridgeKeys: iconBridgeKeys,
    }),
  );

  const bridgeIcon = useBridgeUIComponent<IconMerged, "Icon">({
    libDefaults,
    componentName: "Icon",
    props: () => split.componentProps,
  });

  const iconAdapter = useIconAdapter();

  const resolvedIcon = $derived(
    resolveIconSource<IconElement>(bridgeIcon.merged.icon, iconAdapter()),
  );

  const sizeClass = $derived.by(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeIcon.entry?.tokens?.size,
    );

    return get(classes, bridgeIcon.merged.size);
  });

  const rootBind = $derived(
    mergePartBind(
      {},
      split.inheritedAttrs,
      cn({
        [sizeClass ?? ""]: true,
      }),
    ),
  );

  return {
    get merged() {
      return bridgeIcon.merged;
    },
    get rootBind() {
      return rootBind;
    },
    get resolvedIcon() {
      return resolvedIcon;
    },
  };
}
