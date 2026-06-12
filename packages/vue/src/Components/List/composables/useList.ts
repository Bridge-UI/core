// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { computed, provide, useAttrs } from "vue";

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
import { LIST_INJECTION_KEY } from "@/Components/List/listInjectionKey";
import {
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
  "customProps",
] as const satisfies readonly (keyof ListOwnProps)[];

type ListLibDefaults = LibDefaultsShape<ListOwnProps, "padding">;

type ListMerged = MergeLibDefaults<ListOwnProps, ListLibDefaults>;

export function useList(props: ListOwnProps, libDefaults: ListLibDefaults) {
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<ListProps, typeof listBridgeKeys>({
      bridgeKeys: listBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeList } = useBridgeUIComponent<
    ListMerged,
    "List"
  >({
    libDefaults,
    componentName: "List",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeList,
    props: () => split.value.componentProps,
  });

  const contextValue = computed(() => {
    return {
      dense: merged.value.dense === true,
    };
  });

  provide(LIST_INJECTION_KEY, contextValue);

  const paddingClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      paddingProps,
      bridgeList.value?.customProps?.padding,
    );

    return get(classes, merged.value.padding);
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, []);
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, rootInheritedAttrs.value, {
      class: cn({
        "m-0 list-none": true,
        [paddingClass.value ?? ""]: true,
        "pl-4": merged.value.nested,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  return {
    merged,
    rootBind,
  };
}
