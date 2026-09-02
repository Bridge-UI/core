// ** External Imports
import { get } from "es-toolkit/compat";
import {
  computed,
  provide,
  ref,
  useAttrs,
  useId,
  type Ref,
  type SetupContext,
} from "vue";

// ** Core Imports
import { getTabId, type TabsActivation } from "@bridge-ui/core/Domain";
import {
  tabsColorProps as colorProps,
  tabsOrientationProps as orientationProps,
  tabsSizeProps as sizeProps,
  tabsVariantProps as variantProps,
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
  TabsEmits,
  TabsOwnProps,
  TabsProps,
} from "@/Components/Tabs/tabs.types";
import {
  TABS_INJECTION_KEY,
  type TabsContextValue,
  type TabsItemEntry,
} from "@/Components/Tabs/tabsInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const tabsBridgeKeys = [
  "size",
  "color",
  "classes",
  "variant",
  "activation",
  "customProps",
  "keepMounted",
  "orientation",
] as const satisfies readonly (keyof TabsOwnProps)[];

type TabsLibDefaults = LibDefaultsShape<
  TabsOwnProps,
  "size" | "color" | "variant" | "activation" | "keepMounted" | "orientation"
>;

type TabsMerged = MergeLibDefaults<TabsOwnProps, TabsLibDefaults>;

export function useTabs(
  props: TabsOwnProps,
  libDefaults: TabsLibDefaults,
  model: Ref<string | undefined>,
  emit: SetupContext<TabsEmits>["emit"],
) {
  const vueId = useId();
  const attrs = useAttrs();
  const tabsId = `bridge-tabs${vueId}`;

  const tabValues = ref<string[]>([]);
  const disabledValues = ref<string[]>([]);
  const tabItems = ref<TabsItemEntry[]>([]);

  const split = computed(() => {
    return splitComponentProps<TabsProps, typeof tabsBridgeKeys>({
      bridgeKeys: tabsBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeTabs } = useBridgeUIComponent<
    TabsMerged,
    "Tabs"
  >({
    libDefaults,
    componentName: "Tabs",
    props: () => split.value.componentProps,
  });

  const selected = computed(() => {
    return model.value ?? "";
  });

  function setSelected(next: string) {
    if (disabledValues.value.includes(next)) {
      return;
    }

    model.value = next;
    emit("update:modelValue", next);
    emit("change", next);
  }

  function registerTab(value: string, disabled = false) {
    if (!tabValues.value.includes(value)) {
      tabValues.value = [...tabValues.value, value];
    }

    if (disabled) {
      if (!disabledValues.value.includes(value)) {
        disabledValues.value = [...disabledValues.value, value];
      }
    } else {
      disabledValues.value = disabledValues.value.filter(
        (item) => item !== value,
      );
    }

    if ((model.value ?? "") === "" && !disabled) {
      model.value = value;
    }

    return () => {
      tabValues.value = tabValues.value.filter((item) => item !== value);
      disabledValues.value = disabledValues.value.filter(
        (item) => item !== value,
      );
    };
  }

  function focusTab(value: string) {
    document.getElementById(getTabId(tabsId, value))?.focus();
  }

  function registerTabItem(entry: TabsItemEntry) {
    const index = tabItems.value.findIndex(
      (item) => item.value === entry.value,
    );

    if (index === -1) {
      tabItems.value = [...tabItems.value, entry];
    } else {
      const next = [...tabItems.value];
      next[index] = entry;
      tabItems.value = next;
    }

    if ((model.value ?? "") === "" && !entry.disabled) {
      model.value = entry.value;
    }

    return () => {
      tabItems.value = tabItems.value.filter(
        (item) => item.value !== entry.value,
      );
    };
  }

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeTabs,
    props: () => split.value.componentProps,
  });

  const sizeClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTabs.value?.tokens?.size,
    );
  });

  const variantClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeTabs.value?.tokens?.variant,
    );
  });

  const colorClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      colorProps,
      bridgeTabs.value?.tokens?.color,
    );
  });

  const orientationClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      orientationProps,
      bridgeTabs.value?.tokens?.orientation,
    );
  });

  const sizeItem = computed(() => {
    return get(sizeClasses.value, merged.value.size);
  });

  const variantItem = computed(() => {
    return get(variantClasses.value, merged.value.variant);
  });

  const colorItem = computed(() => {
    return get(colorClasses.value, merged.value.color);
  });

  const orientationItem = computed(() => {
    return get(orientationClasses.value, merged.value.orientation);
  });

  const isVertical = computed(() => {
    return merged.value.orientation === "vertical";
  });

  const tabOrientation = computed(() => {
    return cn({
      [get(orientationItem.value, "tab") ?? ""]: true,
      [get(variantItem.value, "tabVertical") ?? ""]: isVertical.value,
    });
  });

  const listOrientation = computed(() => {
    return cn({
      [get(orientationItem.value, "list") ?? ""]: true,
      [get(variantItem.value, "listVertical") ?? ""]: isVertical.value,
    });
  });

  const contextValue = computed((): TabsContextValue => {
    return {
      focusTab,
      id: tabsId,
      setSelected,
      registerTab,
      registerTabItem,
      selected: selected.value,
      tabItems: tabItems.value,
      tabValues: tabValues.value,
      disabledValues: disabledValues.value,
      keepMounted: merged.value.keepMounted !== false,
      activation: (merged.value.activation ?? "automatic") as TabsActivation,
      orientation:
        (merged.value.orientation as "vertical" | "horizontal") ?? "horizontal",
      tokenClasses: {
        softFill: false,
        tabSize: get(sizeItem.value, "tab"),
        iconGap: get(sizeItem.value, "gap"),
        tabOrientation: tabOrientation.value,
        iconSize: get(sizeItem.value, "icon"),
        listSize: get(sizeItem.value, "list"),
        listOrientation: listOrientation.value,
        panelSize: get(sizeItem.value, "panel"),
        tabVariant: get(variantItem.value, "tab"),
        listVariant: get(variantItem.value, "list"),
        colorSelected: get(colorItem.value, "tabSelected"),
        rootOrientation: get(orientationItem.value, "root"),
        panelOrientation: get(orientationItem.value, "panel"),
        tabVariantSelected: get(variantItem.value, "tabSelected"),
        colorSelectedSoft: get(colorItem.value, "tabSelectedSoft"),
      },
    };
  });

  provide(TABS_INJECTION_KEY, contextValue);

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, split.value.inheritedAttrs, {
      class: cn({
        [get(orientationItem.value, "root") ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  return {
    merged,
    rootBind,
    tabItems,
    contextValue,
  };
}
