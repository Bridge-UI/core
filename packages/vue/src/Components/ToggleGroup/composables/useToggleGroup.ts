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
import {
  cn,
  getAdjacentTabValue,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  colorProps,
  orientationProps,
  roundedProps,
  sizeProps,
  variantProps,
} from "@bridge-ui/core/Tokens/ToggleGroup";

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
  "customProps",
  "orientation",
] as const satisfies readonly (keyof ToggleGroupOwnProps)[];

type ToggleGroupLibDefaults = LibDefaultsShape<
  ToggleGroupOwnProps,
  "full" | "size" | "color" | "rounded" | "variant" | "disabled" | "orientation"
>;

type ToggleGroupMerged = MergeLibDefaults<
  ToggleGroupOwnProps,
  ToggleGroupLibDefaults
>;

/**
 * Builds a stable DOM id for a toggle segment.
 */
function getToggleId(groupId: string, value: string) {
  return `${groupId}-toggle-${value}`;
}

export function useToggleGroup(
  props: ToggleGroupOwnProps,
  libDefaults: ToggleGroupLibDefaults,
  model: Ref<string | undefined>,
  emit: SetupContext<ToggleGroupEmits>["emit"],
) {
  const vueId = useId();
  const attrs = useAttrs();
  const groupId = `bridge-toggle-group${vueId}`;

  const toggleValues = ref<string[]>([]);
  const disabledValues = ref<string[]>([]);

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

  const selected = computed(() => {
    return model.value ?? "";
  });

  function setSelected(next: string) {
    if (merged.value.disabled || disabledValues.value.includes(next)) {
      return;
    }

    model.value = next;
    emit("update:modelValue", next);
    emit("change", next);
  }

  function registerToggle(value: string, disabled = false) {
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

    if ((model.value ?? "") === "" && !disabled) {
      model.value = value;
    }

    return () => {
      toggleValues.value = toggleValues.value.filter((item) => item !== value);
      disabledValues.value = disabledValues.value.filter(
        (item) => item !== value,
      );
    };
  }

  function focusToggle(value: string) {
    document.getElementById(getToggleId(groupId, value))?.focus();
  }

  function handleKeydown(event: KeyboardEvent) {
    const horizontal =
      (merged.value.orientation ?? "horizontal") === "horizontal";
    const nextKey = horizontal ? "ArrowRight" : "ArrowDown";
    const prevKey = horizontal ? "ArrowLeft" : "ArrowUp";

    const activeId =
      typeof document !== "undefined" ? document.activeElement?.id : undefined;
    const focused =
      toggleValues.value.find(
        (value) => getToggleId(groupId, value) === activeId,
      ) ?? selected.value;

    if (event.key === nextKey || event.key === prevKey) {
      event.preventDefault();

      const direction = event.key === nextKey ? 1 : -1;
      const next = getAdjacentTabValue(
        toggleValues.value,
        focused,
        direction,
        new Set(disabledValues.value),
      );

      focusToggle(next);
      setSelected(next);

      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const first =
        toggleValues.value.find(
          (value) => !disabledValues.value.includes(value),
        ) ?? selected.value;

      focusToggle(first);
      setSelected(first);

      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const last =
        [...toggleValues.value]
          .reverse()
          .find((value) => !disabledValues.value.includes(value)) ??
        selected.value;

      focusToggle(last);
      setSelected(last);
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
      focusToggle,
      id: groupId,
      setSelected,
      registerToggle,
      selected: selected.value,
      toggleValues: toggleValues.value,
      full: merged.value.full === true,
      disabledValues: disabledValues.value,
      disabled: merged.value.disabled === true,
      orientation:
        (merged.value.orientation as "vertical" | "horizontal") ?? "horizontal",
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
      role: "radiogroup",
      onKeydown: handleKeydown,
      "aria-disabled": merged.value.disabled === true || undefined,
      "aria-orientation":
        (merged.value.orientation as "vertical" | "horizontal") ?? "horizontal",
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

export { getToggleId };
