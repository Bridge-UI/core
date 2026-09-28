// ** External Imports
import { computed, useAttrs, type SetupContext } from "vue";

// ** Core Imports
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  ActionFooterClasses,
  ActionFooterEmits,
  ActionFooterOwnProps,
  ActionFooterProps,
} from "@/Components/ActionFooter/actionFooter.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const actionFooterBridgeKeys = [
  "color",
  "classes",
  "applyLabel",
  "cancelLabel",
  "customProps",
  "applyVariant",
  "cancelVariant",
] as const satisfies readonly (keyof ActionFooterOwnProps)[];

type ActionFooterLibDefaults = LibDefaultsShape<
  ActionFooterOwnProps,
  "color" | "cancelVariant"
>;

type ActionFooterMerged = MergeLibDefaults<
  ActionFooterOwnProps,
  ActionFooterLibDefaults
>;

export function useActionFooter(
  props: ActionFooterOwnProps,
  libDefaults: ActionFooterLibDefaults,
  emit: SetupContext<ActionFooterEmits>["emit"],
) {
  const attrs = useAttrs();
  const resolveMessage = useResolveMessage();

  const split = computed(() => {
    return splitComponentProps<
      ActionFooterProps,
      typeof actionFooterBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: actionFooterBridgeKeys,
    });
  });

  const { merged, entry: bridgeActionFooter } = useBridgeUIComponent<
    ActionFooterMerged,
    "ActionFooter"
  >({
    libDefaults,
    componentName: "ActionFooter",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ActionFooterClasses>({
    entry: bridgeActionFooter,
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const applyLabel = computed(() => {
    return merged.value.applyLabel ?? resolveMessage("Apply");
  });

  const cancelLabel = computed(() => {
    return merged.value.cancelLabel ?? resolveMessage("Cancel");
  });

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      split.value.inheritedAttrs,
      cn({
        contents: true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const applyButtonBind = computed(() => {
    return mergePartBind(
      customProps.value?.applyButton,
      {
        color: merged.value.color,
        onClick: () => emit("apply"),
        variant: merged.value.applyVariant,
      },
      cn({
        [mergedClasses.value.applyButton ?? ""]: true,
      }),
    );
  });

  const cancelButtonBind = computed(() => {
    return mergePartBind(
      customProps.value?.cancelButton,
      {
        color: merged.value.color,
        onClick: () => emit("cancel"),
        variant: merged.value.cancelVariant,
      },
      cn({
        [mergedClasses.value.cancelButton ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    rootBind,
    applyLabel,
    cancelLabel,
    mergedClasses,
    applyButtonBind,
    cancelButtonBind,
  };
}
