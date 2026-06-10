// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { paddingProps } from "@bridge-ui/core/Components/List";

// ** Local Imports
import type { ListOwnProps, ListProps } from "@/Components/List/list.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const listBridgeKeys = [
  "as",
  "dense",
  "nested",
  "classes",
  "padding",
  "partsProps",
] as const satisfies readonly (keyof ListOwnProps)[];

type ListLibDefaults = LibDefaultsShape<ListOwnProps, "padding">;

type ListMerged = MergeLibDefaults<ListOwnProps, ListLibDefaults>;

export function useList(props: ListProps, libDefaults: ListLibDefaults) {
  const { customProps, inheritedAttrs } = splitComponentProps<
    ListProps,
    typeof listBridgeKeys
  >({
    props,
    bridgeKeys: listBridgeKeys,
  });

  const { merged, entry: bridgeList } = useBridgeUIComponent<
    ListMerged,
    "List"
  >({
    libDefaults,
    props: customProps,
    componentName: "List",
  });

  const children = derived(() => {
    return props.children;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeList,
    props: customProps,
  });

  const paddingClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      paddingProps,
      bridgeList?.customProps?.padding,
    );

    return get(classes, merged.padding);
  }, [merged.padding, bridgeList?.customProps?.padding]);

  const contextValue = derived(() => {
    return {
      dense: merged.dense === true,
    };
  });

  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const rootBind = derived(() => {
    return mergePartBind(partsProps?.root, rootInheritedAttrs, {
      className: cn({
        "m-0 list-none": true,
        [paddingClass ?? ""]: true,
        "pl-4": merged.nested,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  return {
    merged,
    children,
    rootBind,
    contextValue,
  };
}
