// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { computed, provide, useAttrs } from "vue";

// ** Core Imports
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

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
  "customProps",
] as const satisfies readonly (keyof ListOwnProps)[];

export function useList(props: ListOwnProps) {
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<ListProps, typeof listBridgeKeys>({
      bridgeKeys: listBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeList } = useBridgeUIComponent<
    ListOwnProps,
    "List"
  >({
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

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, []);
  });

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "m-0 list-none py-2 text-dark-900 dark:text-dark-100": true,
        "pl-4": merged.value.nested,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    rootBind,
  };
}
