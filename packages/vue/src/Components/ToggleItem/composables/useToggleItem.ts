// ** External Imports
import { get } from "es-toolkit/compat";
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  useAttrs,
  watch,
} from "vue";

// ** Core Imports
import type { IconSize } from "@bridge-ui/core/Tokens";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { getToggleItemId } from "@/Components/ToggleGroup/composables/useToggleGroup";
import { TOGGLE_GROUP_INJECTION_KEY } from "@/Components/ToggleGroup/toggleGroupInjectionKey";
import type {
  ToggleItemOwnProps,
  ToggleItemProps,
} from "@/Components/ToggleItem/toggleItem.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";
import { isToggleGroupItemSelected } from "@bridge-ui/core/Domain";

const toggleItemBridgeKeys = [
  "value",
  "classes",
  "disabled",
  "startIcon",
  "customProps",
] as const satisfies readonly (keyof ToggleItemOwnProps)[];

export function useToggleItem(props: ToggleItemOwnProps) {
  const attrs = useAttrs();

  const injectedToggleGroupContext = inject(TOGGLE_GROUP_INJECTION_KEY, null);

  if (!injectedToggleGroupContext) {
    throw new Error("ToggleItem must be used within a ToggleGroup provider");
  }

  const groupContextRef = injectedToggleGroupContext;

  const split = computed(() => {
    return splitComponentProps<ToggleItemProps, typeof toggleItemBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: toggleItemBridgeKeys,
    });
  });

  const { merged, entry: bridgeToggleItem } = useBridgeUIComponent<
    ToggleItemOwnProps,
    "ToggleItem"
  >({
    componentName: "ToggleItem",
    props: () => split.value.componentProps,
  });

  const value = computed(() => {
    return merged.value.value;
  });

  const disabled = computed(() => {
    return groupContextRef.value.disabled || merged.value.disabled === true;
  });

  const selected = computed(() => {
    return isToggleGroupItemSelected(
      groupContextRef.value.selected,
      value.value,
      groupContextRef.value.multiple,
    );
  });

  let unregister: null | (() => void) = null;

  function syncRegistration() {
    unregister?.();
    unregister = groupContextRef.value.registerToggleItem(
      value.value,
      merged.value.disabled === true,
    );
  }

  onMounted(syncRegistration);

  watch([value, () => merged.value.disabled], syncRegistration);

  onBeforeUnmount(() => {
    unregister?.();
    unregister = null;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeToggleItem,
    props: () => split.value.componentProps,
  });

  function handleClick(event: PointerEvent) {
    if (disabled.value) {
      return;
    }

    groupContextRef.value.toggleItem(value.value);
    split.value.inheritedAttrs.onClick?.(event);
  }

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const iconSize = computed(() => {
    return (groupContextRef.value.tokenClasses.iconSize ??
      "md") as keyof IconSize;
  });

  const rootBind = computed(() => {
    const group = groupContextRef.value;

    const isTabStop = group.focusedValue
      ? group.focusedValue === value.value
      : selected.value;

    return mergePartBind(customProps.value?.root, split.value.inheritedAttrs, {
      type: "button",
      onClick: handleClick,
      disabled: disabled.value,
      tabindex: isTabStop ? 0 : -1,
      role: group.multiple ? "button" : "radio",
      id: getToggleItemId(group.id, value.value),
      "aria-pressed": selected.value && group.multiple,
      "aria-checked": selected.value && !group.multiple,
      class: cn({
        "inline-flex cursor-pointer items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:pointer-events-none disabled:opacity-50": true,
        [group.tokenClasses.iconGap ?? ""]: true,
        [group.tokenClasses.itemSize ?? ""]: true,
        [group.tokenClasses.itemVariant ?? ""]: true,
        [group.tokenClasses.itemRounded ?? ""]: true,
        [group.tokenClasses.itemOrientation ?? ""]: true,
        [group.tokenClasses.itemVariantSelected ?? ""]: selected.value,
        [group.tokenClasses.colorSelected ?? ""]: selected.value,
        [group.tokenClasses.colorSelectedSoft ?? ""]:
          selected.value && group.tokenClasses.softFill === true,
        [get(mergedClasses.value, "root") ?? ""]: true,
        "flex-1": group.full,
      }),
    });
  });

  const startIconBind = computed(() => {
    return mergePartBind(
      customProps.value?.startIcon,
      {},
      cn({
        "shrink-0": true,
        [get(mergedClasses.value, "startIcon") ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    iconSize,
    rootBind,
    selected,
    startIconBind,
  };
}
