// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  emptyStateAlignProps as alignProps,
  emptyStateSizeProps as sizeProps,
  type IconSize,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  EmptyStateOwnProps,
  EmptyStateProps,
} from "@/Components/EmptyState/emptyState.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const emptyStateBridgeKeys = [
  "icon",
  "size",
  "align",
  "title",
  "classes",
  "titleAs",
  "customProps",
  "description",
  "mediaDecorative",
] as const satisfies readonly (keyof EmptyStateOwnProps)[];

type EmptyStateLibDefaults = LibDefaultsShape<
  EmptyStateOwnProps,
  "size" | "align" | "titleAs" | "mediaDecorative"
>;

type EmptyStateMerged = MergeLibDefaults<
  EmptyStateOwnProps,
  EmptyStateLibDefaults
>;

export function useEmptyState(
  props: EmptyStateProps,
  libDefaults: EmptyStateLibDefaults,
) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    EmptyStateProps,
    typeof emptyStateBridgeKeys
  >({
    props,
    bridgeKeys: emptyStateBridgeKeys,
  });

  const { merged, entry: bridgeEmptyState } = useBridgeUIComponent<
    EmptyStateMerged,
    "EmptyState"
  >({
    libDefaults,
    props: componentProps,
    componentName: "EmptyState",
  });

  const slots = derived(() => {
    return props.slots;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: componentProps,
    entry: bridgeEmptyState,
  });

  const sizeItem = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeEmptyState?.tokens?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeEmptyState?.tokens?.size]);

  const alignClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      alignProps,
      bridgeEmptyState?.tokens?.align,
    );

    return get(classes, merged.align);
  }, [merged.align, bridgeEmptyState?.tokens?.align]);

  const actionsBind = derived(() => {
    return mergePartBind(
      customProps?.actions,
      {},
      cn({
        [get(sizeItem, "actions") ?? ""]: true,
        [get(mergedClasses, "actions") ?? ""]: true,
      }),
    );
  });

  const descriptionBind = derived(() => {
    return mergePartBind(
      customProps?.description,
      {},
      cn({
        [get(sizeItem, "description") ?? ""]: true,
        [get(mergedClasses, "description") ?? ""]: true,
      }),
    );
  });

  const iconBind = derived(() => {
    return mergePartBind(
      customProps?.icon,
      {},
      {
        size: (get(sizeItem, "icon") ?? "md") as keyof IconSize,
        className: cn({
          "shrink-0": true,
          [get(mergedClasses, "icon") ?? ""]: true,
        }),
      },
    );
  });

  const mediaBind = derived(() => {
    return mergePartBind(
      customProps?.media,
      {},
      {
        "aria-hidden": merged.mediaDecorative ? true : undefined,
        className: cn({
          [get(sizeItem, "media") ?? ""]: true,
          [get(mergedClasses, "media") ?? ""]: true,
        }),
      },
    );
  });

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        [get(sizeItem, "root") ?? ""]: true,
        [alignClass ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    );
  });

  const titleBind = derived(() => {
    return mergePartBind(
      customProps?.title,
      {},
      cn({
        [get(sizeItem, "title") ?? ""]: true,
        [get(mergedClasses, "title") ?? ""]: true,
      }),
    );
  });

  return {
    slots,
    merged,
    iconBind,
    rootBind,
    titleBind,
    mediaBind,
    actionsBind,
    descriptionBind,
  };
}
