// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useCallback, useId, useMemo, useState } from "react";

// ** Core Imports
import {
  cn,
  getTabId,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
  type TabsActivation,
} from "@bridge-ui/core";
import {
  colorProps,
  orientationProps,
  sizeProps,
  variantProps,
} from "@bridge-ui/core/Components/Tabs";

// ** Local Imports
import type {
  TabsContextValue,
  TabsItemEntry,
} from "@/Components/Tabs/TabsContext";
import type { TabsOwnProps, TabsProps } from "@/Components/Tabs/tabs.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const tabsBridgeKeys = [
  "size",
  "color",
  "value",
  "classes",
  "variant",
  "onChange",
  "activation",
  "customProps",
  "keepMounted",
  "orientation",
  "defaultValue",
] as const satisfies readonly (keyof TabsOwnProps)[];

type TabsLibDefaults = LibDefaultsShape<
  TabsOwnProps,
  "size" | "color" | "variant" | "activation" | "keepMounted" | "orientation"
>;

type TabsMerged = MergeLibDefaults<TabsOwnProps, TabsLibDefaults>;

export function useTabs(props: TabsProps, libDefaults: TabsLibDefaults) {
  const reactId = useId();
  const tabsId = `bridge-tabs${reactId.replace(/:/g, "")}`;

  const [tabValues, setTabValues] = useState<string[]>([]);
  const [disabledValues, setDisabledValues] = useState<string[]>([]);
  const [tabItems, setTabItems] = useState<TabsItemEntry[]>([]);

  const { componentProps, inheritedAttrs } = splitComponentProps<
    TabsProps,
    typeof tabsBridgeKeys
  >({
    props,
    bridgeKeys: tabsBridgeKeys,
  });

  const { merged, entry: bridgeTabs } = useBridgeUIComponent<
    TabsMerged,
    "Tabs"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Tabs",
  });

  const isControlled = props.value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(
    () => props.defaultValue ?? "",
  );

  const selected = isControlled ? (props.value ?? "") : uncontrolled;

  const rootInheritedAttrs = omit(inheritedAttrs, ["children", "onChange"]);

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeTabs,
    props: componentProps,
  });

  const sizeClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTabs?.customProps?.size,
    );
  }, [bridgeTabs?.customProps?.size]);

  const variantClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeTabs?.customProps?.variant,
    );
  }, [bridgeTabs?.customProps?.variant]);

  const colorClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      colorProps,
      bridgeTabs?.customProps?.color,
    );
  }, [bridgeTabs?.customProps?.color]);

  const orientationClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      orientationProps,
      bridgeTabs?.customProps?.orientation,
    );
  }, [bridgeTabs?.customProps?.orientation]);

  const sizeItem = get(sizeClasses, merged.size);
  const variantItem = get(variantClasses, merged.variant);
  const colorItem = get(colorClasses, merged.color);

  const setSelected = useCallback(
    (next: string) => {
      if (disabledValues.includes(next)) {
        return;
      }

      if (!isControlled) {
        setUncontrolled(next);
      }

      merged.onChange?.(next);
    },
    [merged, isControlled, disabledValues],
  );

  const registerTab = useCallback(
    (value: string, disabled = false) => {
      setTabValues((previous) => {
        if (previous.includes(value)) {
          return previous;
        }

        return [...previous, value];
      });

      setDisabledValues((previous) => {
        if (disabled) {
          return previous.includes(value) ? previous : [...previous, value];
        }

        return previous.filter((item) => item !== value);
      });

      if (!isControlled) {
        setUncontrolled((current) => {
          return current === "" && !disabled ? value : current;
        });
      }

      return () => {
        setTabValues((previous) => previous.filter((item) => item !== value));
        setDisabledValues((previous) =>
          previous.filter((item) => item !== value),
        );
      };
    },
    [isControlled],
  );

  const registerTabItem = useCallback(
    (entry: TabsItemEntry) => {
      setTabItems((previous) => {
        const index = previous.findIndex((item) => item.value === entry.value);

        if (index === -1) {
          return [...previous, entry];
        }

        const next = [...previous];
        next[index] = entry;

        return next;
      });

      if (!isControlled) {
        setUncontrolled((current) => {
          return current === "" && !entry.disabled ? entry.value : current;
        });
      }

      return () => {
        setTabItems((previous) =>
          previous.filter((item) => item.value !== entry.value),
        );
      };
    },
    [isControlled],
  );

  const focusTab = useCallback(
    (value: string) => {
      document.getElementById(getTabId(tabsId, value))?.focus();
    },
    [tabsId],
  );

  const contextValue = useMemo((): TabsContextValue => {
    return {
      selected,
      focusTab,
      tabItems,
      tabValues,
      id: tabsId,
      setSelected,
      registerTab,
      disabledValues,
      registerTabItem,
      keepMounted: merged.keepMounted !== false,
      activation: (merged.activation ?? "automatic") as TabsActivation,
      orientation:
        (merged.orientation as "vertical" | "horizontal") ?? "horizontal",
      tokenClasses: {
        tabSize: get(sizeItem, "tab"),
        listSize: get(sizeItem, "list"),
        panelSize: get(sizeItem, "panel"),
        tabVariant: get(variantItem, "tab"),
        listVariant: get(variantItem, "list"),
        colorSelected: get(colorItem, "tabSelected"),
        tabVariantSelected: get(variantItem, "tabSelected"),
        listOrientation: get(orientationClasses, merged.orientation),
      },
    };
  }, [
    tabsId,
    selected,
    focusTab,
    tabItems,
    sizeItem,
    tabValues,
    colorItem,
    setSelected,
    registerTab,
    variantItem,
    disabledValues,
    registerTabItem,
    merged.activation,
    merged.keepMounted,
    merged.orientation,
    orientationClasses,
  ]);

  const customProps = merged.customProps;

  const rootBind = mergePartBind(customProps?.root, rootInheritedAttrs, {
    className: cn({
      [get(mergedClasses, "root") ?? ""]: true,
    }),
  });

  return {
    merged,
    rootBind,
    tabItems,
    contextValue,
    children: props.children,
  };
}
