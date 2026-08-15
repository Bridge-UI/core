// ** External Imports
import { get, head, isArray, omit } from "es-toolkit/compat";
import {
  useCallback,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";

// ** Core Imports
import {
  applyToggleGroupSelection,
  cn,
  getAdjacentTabValue,
  mergeBridgeUILayeredClasses,
  normalizeToggleGroupValue,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
  type ToggleGroupValue,
} from "@bridge-ui/core";
import {
  colorProps,
  orientationProps,
  roundedProps,
  sizeProps,
  variantProps,
} from "@bridge-ui/core/Tokens/ToggleGroup";

// ** Local Imports
import type { ToggleGroupContextValue } from "@/Components/ToggleGroup/ToggleGroupContext";
import type {
  ToggleGroupOwnProps,
  ToggleGroupProps,
} from "@/Components/ToggleGroup/toggleGroup.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const toggleGroupBridgeKeys = [
  "full",
  "size",
  "color",
  "value",
  "classes",
  "rounded",
  "variant",
  "disabled",
  "multiple",
  "onChange",
  "customProps",
  "orientation",
  "defaultValue",
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
function resolveFocusFallback(
  selected: ToggleGroupValue,
  toggleValues: string[],
) {
  if (isArray(selected)) {
    return head(selected) ?? head(toggleValues) ?? "";
  }

  return selected || head(toggleValues) || "";
}

export function useToggleGroup(
  props: ToggleGroupProps,
  libDefaults: ToggleGroupLibDefaults,
) {
  const reactId = useId();
  const groupId = `bridge-toggle-group${reactId.replace(/:/g, "")}`;

  const [focusedValue, setFocusedValue] = useState("");
  const [toggleValues, setToggleValues] = useState<string[]>([]);
  const [disabledValues, setDisabledValues] = useState<string[]>([]);

  const { componentProps, inheritedAttrs } = splitComponentProps<
    ToggleGroupProps,
    typeof toggleGroupBridgeKeys
  >({
    props,
    bridgeKeys: toggleGroupBridgeKeys,
  });

  const { merged, entry: bridgeToggleGroup } = useBridgeUIComponent<
    ToggleGroupMerged,
    "ToggleGroup"
  >({
    libDefaults,
    props: componentProps,
    componentName: "ToggleGroup",
  });

  const multiple = derived(() => {
    return merged.multiple === true;
  });

  const orientation = derived(() => {
    return (merged.orientation as "vertical" | "horizontal") ?? "horizontal";
  });

  const isControlled = derived(() => {
    return props.value !== undefined;
  });

  const [uncontrolled, setUncontrolled] = useState<ToggleGroupValue>(() =>
    normalizeToggleGroupValue(props.defaultValue, props.multiple === true),
  );

  const selected = derived(() => {
    return normalizeToggleGroupValue(
      isControlled ? props.value : uncontrolled,
      multiple,
    );
  });

  const children = derived(() => {
    return props.children;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children", "onChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: componentProps,
    entry: bridgeToggleGroup,
  });

  const sizeClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeToggleGroup?.tokens?.size,
    );
  }, [bridgeToggleGroup?.tokens?.size]);

  const variantClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeToggleGroup?.tokens?.variant,
    );
  }, [bridgeToggleGroup?.tokens?.variant]);

  const colorClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      colorProps,
      bridgeToggleGroup?.tokens?.color,
    );
  }, [bridgeToggleGroup?.tokens?.color]);

  const roundedClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeToggleGroup?.tokens?.rounded,
    );
  }, [bridgeToggleGroup?.tokens?.rounded]);

  const orientationClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      orientationProps,
      bridgeToggleGroup?.tokens?.orientation,
    );
  }, [bridgeToggleGroup?.tokens?.orientation]);

  const sizeItem = derived(() => {
    return get(sizeClasses, merged.size);
  });

  const variantItem = derived(() => {
    return get(variantClasses, merged.variant);
  });

  const colorItem = derived(() => {
    return get(colorClasses, merged.color);
  });

  const roundedItem = derived(() => {
    return get(roundedClasses, merged.rounded);
  });

  const orientationItem = derived(() => {
    return get(orientationClasses, merged.orientation);
  });

  const toggleItem = useCallback(
    (nextValue: string) => {
      if (merged.disabled || disabledValues.includes(nextValue)) {
        return;
      }

      const next = applyToggleGroupSelection(selected, nextValue, multiple);

      if (!isControlled) {
        setUncontrolled(next);
      }

      setFocusedValue(nextValue);
      merged.onChange?.(next);
    },
    [merged, selected, multiple, isControlled, disabledValues],
  );

  const registerToggleItem = useCallback(
    (value: string, disabled = false) => {
      setToggleValues((previous) => {
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

      setFocusedValue((current) => {
        return current === "" && !disabled ? value : current;
      });

      if (!isControlled && !multiple) {
        setUncontrolled((current) => {
          return current === "" && !disabled ? value : current;
        });
      }

      return () => {
        setToggleValues((previous) =>
          previous.filter((item) => item !== value),
        );
        setDisabledValues((previous) =>
          previous.filter((item) => item !== value),
        );
      };
    },
    [isControlled, multiple],
  );

  const focusToggleItem = useCallback(
    (value: string) => {
      setFocusedValue(value);
      document.getElementById(getToggleItemId(groupId, value))?.focus();
    },
    [groupId],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const horizontal = orientation === "horizontal";

      const prevKey = horizontal ? "ArrowLeft" : "ArrowUp";
      const nextKey = horizontal ? "ArrowRight" : "ArrowDown";

      const activeId = get(document, "activeElement.id");
      const focused =
        toggleValues.find((value) => {
          return getToggleItemId(groupId, value) === activeId;
        }) ??
        (focusedValue || resolveFocusFallback(selected, toggleValues));

      if (event.key === nextKey || event.key === prevKey) {
        event.preventDefault();

        const direction = event.key === nextKey ? 1 : -1;
        const next = getAdjacentTabValue(
          toggleValues,
          focused,
          direction,
          new Set(disabledValues),
        );

        focusToggleItem(next);

        if (!multiple) {
          toggleItem(next);
        }

        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        const first =
          toggleValues.find((value) => !disabledValues.includes(value)) ??
          focused;

        focusToggleItem(first);

        if (!multiple) {
          toggleItem(first);
        }

        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        const last =
          [...toggleValues]
            .reverse()
            .find((value) => !disabledValues.includes(value)) ?? focused;

        focusToggleItem(last);

        if (!multiple) {
          toggleItem(last);
        }
      }
    },
    [
      groupId,
      multiple,
      selected,
      toggleItem,
      orientation,
      focusedValue,
      toggleValues,
      disabledValues,
      focusToggleItem,
    ],
  );

  const contextValue = useMemo((): ToggleGroupContextValue => {
    return {
      multiple,
      selected,
      toggleItem,
      id: groupId,
      orientation,
      toggleValues,
      focusedValue,
      disabledValues,
      focusToggleItem,
      registerToggleItem,
      full: merged.full === true,
      disabled: merged.disabled === true,
      tokenClasses: {
        iconGap: get(sizeItem, "gap"),
        itemSize: get(sizeItem, "item"),
        iconSize: get(sizeItem, "icon"),
        rootSize: get(sizeItem, "root"),
        softFill: merged.variant === "solid",
        itemVariant: get(variantItem, "item"),
        rootVariant: get(variantItem, "root"),
        itemRounded: get(roundedItem, "item"),
        rootRounded: get(roundedItem, "root"),
        itemOrientation: get(orientationItem, "item"),
        colorSelected: get(colorItem, "itemSelected"),
        rootOrientation: get(orientationItem, "root"),
        itemVariantSelected: get(variantItem, "itemSelected"),
        colorSelectedSoft: get(colorItem, "itemSelectedSoft"),
      },
    };
  }, [
    groupId,
    multiple,
    selected,
    sizeItem,
    colorItem,
    merged.full,
    roundedItem,
    toggleItem,
    orientation,
    variantItem,
    focusedValue,
    toggleValues,
    disabledValues,
    merged.variant,
    focusToggleItem,
    merged.disabled,
    orientationItem,
    registerToggleItem,
  ]);

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      onKeyDown: handleKeyDown,
      "aria-orientation": orientation,
      role: multiple ? "group" : "radiogroup",
      "aria-disabled": merged.disabled === true || undefined,
      className: cn({
        [get(sizeItem, "root") ?? ""]: true,
        [get(variantItem, "root") ?? ""]: true,
        [get(roundedItem, "root") ?? ""]: true,
        [get(orientationItem, "root") ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
        "w-full": merged.full === true,
        "opacity-50 pointer-events-none": merged.disabled === true,
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

export { getToggleItemId };
