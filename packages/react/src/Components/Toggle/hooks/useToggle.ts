// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useEffect, type MouseEvent } from "react";

// ** Core Imports
import type { IconSize } from "@bridge-ui/core/Tokens/Icon";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  ToggleOwnProps,
  ToggleProps,
} from "@/Components/Toggle/toggle.types";
import { useToggleGroupContext } from "@/Components/ToggleGroup/ToggleGroupContext";
import { getToggleId } from "@/Components/ToggleGroup/hooks/useToggleGroup";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const toggleBridgeKeys = [
  "value",
  "classes",
  "disabled",
  "startIcon",
  "customProps",
] as const satisfies readonly (keyof ToggleOwnProps)[];

export function useToggle(props: ToggleProps) {
  const group = useToggleGroupContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    ToggleProps,
    typeof toggleBridgeKeys
  >({
    props,
    bridgeKeys: toggleBridgeKeys,
  });

  const { merged, entry: bridgeToggle } = useBridgeUIComponent<
    ToggleOwnProps,
    "Toggle"
  >({
    props: componentProps,
    componentName: "Toggle",
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
    return group.selected === value;
  });

  const iconSize = derived(() => {
    return (group.tokenClasses.iconSize ?? "md") as keyof IconSize;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

  useEffect(() => {
    return group.registerToggle(value, merged.disabled === true);
  }, [value, merged.disabled, group.registerToggle]);

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeToggle,
    props: componentProps,
  });

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    group.setSelected(value);
    rootInheritedAttrs.onClick?.(event);
  }

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      disabled,
      role: "radio",
      type: "button",
      onClick: handleClick,
      "aria-checked": selected,
      tabIndex: selected ? 0 : -1,
      id: getToggleId(group.id, value),
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
