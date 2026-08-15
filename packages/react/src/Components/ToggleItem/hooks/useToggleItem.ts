// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useEffect, type MouseEvent } from "react";

// ** Core Imports
import type { IconSize } from "@bridge-ui/core/Tokens/Icon";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useToggleGroupContext } from "@/Components/ToggleGroup/ToggleGroupContext";
import { getToggleItemId } from "@/Components/ToggleGroup/hooks/useToggleGroup";
import type {
  ToggleItemOwnProps,
  ToggleItemProps,
} from "@/Components/ToggleItem/toggleItem.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";
import { isToggleGroupItemSelected } from "@bridge-ui/core";

const toggleItemBridgeKeys = [
  "value",
  "classes",
  "disabled",
  "startIcon",
  "customProps",
] as const satisfies readonly (keyof ToggleItemOwnProps)[];

export function useToggleItem(props: ToggleItemProps) {
  const group = useToggleGroupContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    ToggleItemProps,
    typeof toggleItemBridgeKeys
  >({
    props,
    bridgeKeys: toggleItemBridgeKeys,
  });

  const { merged, entry: bridgeToggleItem } = useBridgeUIComponent<
    ToggleItemOwnProps,
    "ToggleItem"
  >({
    props: componentProps,
    componentName: "ToggleItem",
  });

  const children = derived(() => {
    return props.children;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const value = derived(() => {
    return merged.value;
  });

  const disabled = derived(() => {
    return group.disabled || merged.disabled === true;
  });

  const selected = derived(() => {
    return isToggleGroupItemSelected(group.selected, value, group.multiple);
  });

  const iconSize = derived(() => {
    return (group.tokenClasses.iconSize ?? "md") as keyof IconSize;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

  useEffect(() => {
    return group.registerToggleItem(value, merged.disabled === true);
  }, [value, merged.disabled, group.registerToggleItem]);

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: componentProps,
    entry: bridgeToggleItem,
  });

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    group.toggleItem(value);
    rootInheritedAttrs.onClick?.(event);
  }

  const rootBind = derived(() => {
    const isTabStop = group.focusedValue
      ? group.focusedValue === value
      : selected;

    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      disabled,
      type: "button",
      onClick: handleClick,
      tabIndex: isTabStop ? 0 : -1,
      id: getToggleItemId(group.id, value),
      role: group.multiple ? "button" : "radio",
      "aria-pressed": selected && group.multiple,
      "aria-checked": selected && !group.multiple,
      className: cn({
        "inline-flex cursor-pointer items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:pointer-events-none disabled:opacity-50": true,
        [group.tokenClasses.iconGap ?? ""]: true,
        [group.tokenClasses.itemSize ?? ""]: true,
        [group.tokenClasses.itemVariant ?? ""]: true,
        [group.tokenClasses.itemRounded ?? ""]: true,
        [group.tokenClasses.itemOrientation ?? ""]: true,
        [group.tokenClasses.itemVariantSelected ?? ""]: selected,
        [group.tokenClasses.colorSelected ?? ""]: selected,
        [group.tokenClasses.colorSelectedSoft ?? ""]:
          selected && group.tokenClasses.softFill === true,
        [get(mergedClasses, "root") ?? ""]: true,
        "flex-1": group.full,
      }),
    });
  });

  const startIconBind = derived(() => {
    return mergePartBind(
      customProps?.startIcon,
      {},
      cn({
        "shrink-0": true,
        [get(mergedClasses, "startIcon") ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    children,
    iconSize,
    rootBind,
    startIconBind,
  };
}
