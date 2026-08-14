// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  useCallback,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";

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
  "onChange",
  "customProps",
  "orientation",
  "defaultValue",
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
function getToggleItemId(groupId: string, value: string) {
  return `${groupId}-toggle-${value}`;
}

export function useToggleGroup(
  props: ToggleGroupProps,
  libDefaults: ToggleGroupLibDefaults,
) {
  const reactId = useId();
  const groupId = `bridge-toggle-group${reactId.replace(/:/g, "")}`;

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

  const isControlled = derived(() => {
    return props.value !== undefined;
  });

  const [uncontrolled, setUncontrolled] = useState(
    () => props.defaultValue ?? "",
  );

  const selected = derived(() => {
    return isControlled ? (props.value ?? "") : uncontrolled;
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

  const setSelected = useCallback(
    (next: string) => {
      if (merged.disabled || disabledValues.includes(next)) {
        return;
      }

      if (!isControlled) {
        setUncontrolled(next);
      }

      merged.onChange?.(next);
    },
    [merged, isControlled, disabledValues],
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

      if (!isControlled) {
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
    [isControlled],
  );

  const focusToggleItem = useCallback(
    (value: string) => {
      document.getElementById(getToggleItemId(groupId, value))?.focus();
    },
    [groupId],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const horizontal = (merged.orientation ?? "horizontal") === "horizontal";
      const nextKey = horizontal ? "ArrowRight" : "ArrowDown";
      const prevKey = horizontal ? "ArrowLeft" : "ArrowUp";

      const activeId =
        typeof document !== "undefined"
          ? document.activeElement?.id
          : undefined;
      const focused =
        toggleValues.find(
          (value) => getToggleItemId(groupId, value) === activeId,
        ) ?? selected;

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
        setSelected(next);

        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        const first =
          toggleValues.find((value) => !disabledValues.includes(value)) ??
          selected;

        focusToggleItem(first);
        setSelected(first);

        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        const last =
          [...toggleValues]
            .reverse()
            .find((value) => !disabledValues.includes(value)) ?? selected;

        focusToggleItem(last);
        setSelected(last);
      }
    },
    [
      groupId,
      selected,
      setSelected,
      toggleValues,
      disabledValues,
      focusToggleItem,
      merged.orientation,
    ],
  );

  const contextValue = useMemo((): ToggleGroupContextValue => {
    return {
      selected,
      id: groupId,
      setSelected,
      toggleValues,
      disabledValues,
      focusToggleItem,
      registerToggleItem,
      full: merged.full === true,
      disabled: merged.disabled === true,
      orientation:
        (merged.orientation as "vertical" | "horizontal") ?? "horizontal",
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
    selected,
    sizeItem,
    colorItem,
    merged.full,
    roundedItem,
    setSelected,
    variantItem,
    toggleValues,
    disabledValues,
    merged.variant,
    focusToggleItem,
    merged.disabled,
    orientationItem,
    merged.orientation,
    registerToggleItem,
  ]);

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      role: "radiogroup",
      onKeyDown: handleKeyDown,
      "aria-disabled": merged.disabled === true || undefined,
      "aria-orientation":
        (merged.orientation as "vertical" | "horizontal") ?? "horizontal",
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
