// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs, useSlots } from "vue";

// ** Core Imports
import {
  emptyStateAlignProps as alignProps,
  emptyStateSizeProps as sizeProps,
  type IconSize,
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
  EmptyStateOwnProps,
  EmptyStateProps,
} from "@/Components/EmptyState/emptyState.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const emptyStateBridgeKeys = [
  "icon",
  "size",
  "align",
  "title",
  "classes",
  "titleAs",
  "customProps",
  "description",
  "mediaDecorative",
] as const satisfies readonly (keyof EmptyStateOwnProps)[];

type EmptyStateLibDefaults = LibDefaultsShape<
  EmptyStateOwnProps,
  "size" | "align" | "titleAs" | "mediaDecorative"
>;

type EmptyStateMerged = MergeLibDefaults<
  EmptyStateOwnProps,
  EmptyStateLibDefaults
>;

export function useEmptyState(
  props: EmptyStateOwnProps,
  libDefaults: EmptyStateLibDefaults,
) {
  const attrs = useAttrs();
  const slots = useSlots();

  const split = computed(() => {
    return splitComponentProps<EmptyStateProps, typeof emptyStateBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: emptyStateBridgeKeys,
    });
  });

  const { merged, entry: bridgeEmptyState } = useBridgeUIComponent<
    EmptyStateMerged,
    "EmptyState"
  >({
    libDefaults,
    componentName: "EmptyState",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeEmptyState,
    props: () => split.value.componentProps,
  });

  const sizeItem = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeEmptyState.value?.tokens?.size,
    );

    return get(classes, merged.value.size);
  });

  const alignClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      alignProps,
      bridgeEmptyState.value?.tokens?.align,
    );

    return get(classes, merged.value.align);
  });

  const actionsBind = computed(() => {
    return mergePartBind(
      customProps.value?.actions,
      {},
      cn({
        [get(sizeItem.value, "actions") ?? ""]: true,
        [get(mergedClasses.value, "actions") ?? ""]: true,
      }),
    );
  });

  const descriptionBind = computed(() => {
    return mergePartBind(
      customProps.value?.description,
      {},
      cn({
        [get(sizeItem.value, "description") ?? ""]: true,
        [get(mergedClasses.value, "description") ?? ""]: true,
      }),
    );
  });

  const iconBind = computed(() => {
    return mergePartBind(
      customProps.value?.icon,
      {},
      {
        size: (get(sizeItem.value, "icon") ?? "md") as keyof IconSize,
        class: cn({
          "shrink-0": true,
          [get(mergedClasses.value, "icon") ?? ""]: true,
        }),
      },
    );
  });

  const mediaBind = computed(() => {
    return mergePartBind(
      customProps.value?.media,
      {},
      {
        "aria-hidden": merged.value.mediaDecorative ? true : undefined,
        class: cn({
          [get(sizeItem.value, "media") ?? ""]: true,
          [get(mergedClasses.value, "media") ?? ""]: true,
        }),
      },
    );
  });

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      split.value.inheritedAttrs,
      cn({
        [get(sizeItem.value, "root") ?? ""]: true,
        [alignClass.value ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    );
  });

  const titleBind = computed(() => {
    return mergePartBind(
      customProps.value?.title,
      {},
      cn({
        [get(sizeItem.value, "title") ?? ""]: true,
        [get(mergedClasses.value, "title") ?? ""]: true,
      }),
    );
  });

  return {
    slots,
    merged,
    iconBind,
    rootBind,
    titleBind,
    mediaBind,
    actionsBind,
    descriptionBind,
  };
}
