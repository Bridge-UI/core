// ** External Imports
import { get, head, isArray } from "es-toolkit/compat";
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
import { applyToggleGroupSelection, getAdjacentTabValue, normalizeToggleGroupValue, ToggleGroupValue } from "@bridge-ui/core/Domain";
import {
  colorProps,
  orientationProps,
  roundedProps,
  sizeProps,
  variantProps,
} from "@bridge-ui/core/Tokens/ToggleGroup";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  ToggleGroupEmits,
  ToggleGroupOwnProps,
  ToggleGroupProps,
} from "@/Components/ToggleGroup/toggleGroup.types";
import {
  TOGGLE_GROUP_INJECTION_KEY,
  type ToggleGroupContextValue,
} from "@/Components/ToggleGroup/toggleGroupInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const toggleGroupBridgeKeys = [
  "full",
  "size",
  "color",
  "classes",
  "rounded",
  "variant",
  "disabled",
  "multiple",
  "customProps",
  "orientation",
] as const satisfies readonly (keyof ToggleGroupOwnProps)[];

type ToggleGroupLibDefaults = LibDefaultsShape<
  ToggleGroupOwnProps,
  | "full"
  | "size"
  | "color"
  | "rounded"
  | "variant"
  | "disabled"
  | "multiple"
  | "orientation"
>;

type ToggleGroupMerged = MergeLibDefaults<
  ToggleGroupOwnProps,
  ToggleGroupLibDefaults
>;

/**
 * Builds a stable DOM id for a toggle segment.
 */
function getToggleItemId(groupId: string, value: string) {
  return `${groupId}-toggle-${value}`;
}

/**
 * Resolves a scalar fallback focus target from the selected value.
 */
function resolveFocusFallback(selected: ToggleGroupValue, values: string[]) {
  if (isArray(selected)) {
    return head(selected) ?? head(values) ?? "";
  }

  return selected || head(values) || "";
}

export function useToggleGroup(
  props: ToggleGroupOwnProps,
  libDefaults: ToggleGroupLibDefaults,
  model: Ref<undefined | ToggleGroupValue>,
  emit: SetupContext<ToggleGroupEmits>["emit"],
) {
  const vueId = useId();
  const attrs = useAttrs();
  const groupId = `bridge-toggle-group${vueId}`;

  const toggleValues = ref<string[]>([]);
  const disabledValues = ref<string[]>([]);
  const focusedValue = ref("");

  const split = computed(() => {
    return splitComponentProps<ToggleGroupProps, typeof toggleGroupBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: toggleGroupBridgeKeys,
    });
  });

  const { merged, entry: bridgeToggleGroup } = useBridgeUIComponent<
    ToggleGroupMerged,
    "ToggleGroup"
  >({
    libDefaults,
    componentName: "ToggleGroup",
    props: () => split.value.componentProps,
  });

  const multiple = computed(() => {
    return merged.value.multiple === true;
  });

  const orientation = computed(() => {
    return (
      (merged.value.orientation as "vertical" | "horizontal") ?? "horizontal"
    );
  });

  const selected = computed(() => {
    return normalizeToggleGroupValue(model.value, multiple.value);
  });

  function toggleItem(nextValue: string) {
    if (merged.value.disabled || disabledValues.value.includes(nextValue)) {
      return;
    }

    const next = applyToggleGroupSelection(
      selected.value,
      nextValue,
      multiple.value,
    );

    model.value = next;
    focusedValue.value = nextValue;
    emit("update:modelValue", next);
    emit("change", next);
  }

  function registerToggleItem(value: string, disabled = false) {
    if (!toggleValues.value.includes(value)) {
      toggleValues.value = [...toggleValues.value, value];
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

    if (focusedValue.value === "" && !disabled) {
      focusedValue.value = value;
    }

    if (!multiple.value && !disabled) {
      const current = normalizeToggleGroupValue(model.value, false);

      if (current === "") {
        model.value = value;
      }
    }

    return () => {
      toggleValues.value = toggleValues.value.filter((item) => item !== value);
      disabledValues.value = disabledValues.value.filter(
        (item) => item !== value,
      );
    };
  }

  function focusToggleItem(value: string) {
    focusedValue.value = value;
    document.getElementById(getToggleItemId(groupId, value))?.focus();
  }

  function handleKeydown(event: KeyboardEvent) {
    const horizontal = orientation.value === "horizontal";

    const prevKey = horizontal ? "ArrowLeft" : "ArrowUp";
    const nextKey = horizontal ? "ArrowRight" : "ArrowDown";

    const activeId = get(document, "activeElement.id");
    const focused =
      toggleValues.value.find((value) => {
        return getToggleItemId(groupId, value) === activeId;
      }) ??
      (focusedValue.value ||
        resolveFocusFallback(selected.value, toggleValues.value));

    if (event.key === nextKey || event.key === prevKey) {
      event.preventDefault();

      const direction = event.key === nextKey ? 1 : -1;
      const next = getAdjacentTabValue(
        toggleValues.value,
        focused,
        direction,
        new Set(disabledValues.value),
      );

      focusToggleItem(next);

      if (!multiple.value) {
        toggleItem(next);
      }

      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const first =
        toggleValues.value.find(
          (value) => !disabledValues.value.includes(value),
        ) ?? focused;

      focusToggleItem(first);

      if (!multiple.value) {
        toggleItem(first);
      }

      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const last =
        [...toggleValues.value]
          .reverse()
          .find((value) => !disabledValues.value.includes(value)) ?? focused;

      focusToggleItem(last);

      if (!multiple.value) {
        toggleItem(last);
      }
    }
  }

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeToggleGroup,
    props: () => split.value.componentProps,
  });

  const sizeClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeToggleGroup.value?.tokens?.size,
    );
  });

  const variantClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeToggleGroup.value?.tokens?.variant,
    );
  });

  const colorClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      colorProps,
      bridgeToggleGroup.value?.tokens?.color,
    );
  });

  const roundedClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeToggleGroup.value?.tokens?.rounded,
    );
  });

  const orientationClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      orientationProps,
      bridgeToggleGroup.value?.tokens?.orientation,
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

  const roundedItem = computed(() => {
    return get(roundedClasses.value, merged.value.rounded);
  });

  const orientationItem = computed(() => {
    return get(orientationClasses.value, merged.value.orientation);
  });

  const contextValue = computed((): ToggleGroupContextValue => {
    return {
      toggleItem,
      id: groupId,
      focusToggleItem,
      registerToggleItem,
      multiple: multiple.value,
      selected: selected.value,
      orientation: orientation.value,
      toggleValues: toggleValues.value,
      focusedValue: focusedValue.value,
      full: merged.value.full === true,
      disabledValues: disabledValues.value,
      disabled: merged.value.disabled === true,
      tokenClasses: {
        iconGap: get(sizeItem.value, "gap"),
        itemSize: get(sizeItem.value, "item"),
        iconSize: get(sizeItem.value, "icon"),
        rootSize: get(sizeItem.value, "root"),
        softFill: merged.value.variant === "solid",
        itemVariant: get(variantItem.value, "item"),
        rootVariant: get(variantItem.value, "root"),
        itemRounded: get(roundedItem.value, "item"),
        rootRounded: get(roundedItem.value, "root"),
        itemOrientation: get(orientationItem.value, "item"),
        colorSelected: get(colorItem.value, "itemSelected"),
        rootOrientation: get(orientationItem.value, "root"),
        itemVariantSelected: get(variantItem.value, "itemSelected"),
        colorSelectedSoft: get(colorItem.value, "itemSelectedSoft"),
      },
    };
  });

  provide(TOGGLE_GROUP_INJECTION_KEY, contextValue);

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, split.value.inheritedAttrs, {
      onKeydown: handleKeydown,
      "aria-orientation": orientation.value,
      role: multiple.value ? "group" : "radiogroup",
      "aria-disabled": merged.value.disabled === true || undefined,
      class: cn({
        [get(sizeItem.value, "root") ?? ""]: true,
        [get(variantItem.value, "root") ?? ""]: true,
        [get(roundedItem.value, "root") ?? ""]: true,
        [get(orientationItem.value, "root") ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
        "w-full": merged.value.full === true,
        "opacity-50 pointer-events-none": merged.value.disabled === true,
      }),
    });
  });

  return {
    merged,
    rootBind,
    contextValue,
  };
}

export { getToggleItemId };
