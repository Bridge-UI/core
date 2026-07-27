// ** External Imports
import { get, omit } from "es-toolkit/compat";

// ** Core Imports
import { cn, splitComponentProps } from "@bridge-ui/core";

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
  "customProps",
] as const satisfies readonly (keyof ListOwnProps)[];

export function useList(props: ListProps) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    ListProps,
    typeof listBridgeKeys
  >({
    props,
    bridgeKeys: listBridgeKeys,
  });

  const { merged, entry: bridgeList } = useBridgeUIComponent<
    ListOwnProps,
    "List"
  >({
    props: componentProps,
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
    props: componentProps,
  });

  const contextValue = derived(() => {
    return {
      dense: merged.dense === true,
    };
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "m-0 list-none py-2": true,
        "pl-4": merged.nested,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    children,
    rootBind,
    contextValue,
  };
}
