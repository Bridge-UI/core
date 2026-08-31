// ** External Imports
import { get, omit } from "es-toolkit/compat";

// ** Core Imports
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useListContext } from "@/Components/List/ListContext";
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
  "iconOnly",
  "customProps",
] as const satisfies readonly (keyof ListOwnProps)[];

export function useList(props: ListProps) {
  const parentList = useListContext();

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
      iconOnly: merged.iconOnly === true || parentList?.iconOnly === true,
    };
  });

  const hideNestedSubmenu = derived(() => {
    return merged.nested === true && contextValue.iconOnly;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      hidden: hideNestedSubmenu ? true : undefined,
      className: cn({
        "m-0 flex list-none flex-col gap-0.5 text-dark-900 dark:text-dark-100":
          true,
        "px-2 py-2": !merged.nested,
        "ml-3.5 translate-x-px border-l border-dark-200 py-0.5 pl-2.5 dark:border-dark-700":
          merged.nested,
        hidden: hideNestedSubmenu,
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
