// ** External Imports
import { omit } from "es-toolkit/compat";

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
  ActionFooterOwnProps,
  ActionFooterProps,
} from "@/Components/ActionFooter/actionFooter.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const actionFooterBridgeKeys = [
  "classes",
  "applyColor",
  "applyLabel",
  "cancelColor",
  "cancelLabel",
  "customProps",
  "applyVariant",
  "cancelVariant",
] as const satisfies readonly (keyof ActionFooterOwnProps)[];

type ActionFooterLibDefaults = LibDefaultsShape<
  ActionFooterOwnProps,
  "applyColor" | "cancelColor" | "cancelVariant"
>;

type ActionFooterMerged = MergeLibDefaults<
  ActionFooterOwnProps,
  ActionFooterLibDefaults
>;

export function useActionFooter(
  props: ActionFooterProps,
  libDefaults: ActionFooterLibDefaults,
) {
  const resolveMessage = useResolveMessage();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    ActionFooterProps,
    typeof actionFooterBridgeKeys
  >({
    props,
    bridgeKeys: actionFooterBridgeKeys,
  });

  const { merged, entry: bridgeActionFooter } = useBridgeUIComponent<
    ActionFooterMerged,
    "ActionFooter"
  >({
    libDefaults,
    props: componentProps,
    componentName: "ActionFooter",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ActionFooterClasses>({
    props: componentProps,
    entry: bridgeActionFooter,
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["onApply", "onCancel"]);
  });

  const applyLabel = derived(() => {
    return merged.applyLabel ?? resolveMessage("Apply");
  });

  const cancelLabel = derived(() => {
    return merged.cancelLabel ?? resolveMessage("Cancel");
  });

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        contents: true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const applyButtonBind = derived(() => {
    return mergePartBind(
      customProps?.applyButton,
      {
        onClick: props.onApply,
        color: merged.applyColor,
        variant: merged.applyVariant,
      },
      cn({
        [mergedClasses.applyButton ?? ""]: true,
      }),
    );
  });

  const cancelButtonBind = derived(() => {
    return mergePartBind(
      customProps?.cancelButton,
      {
        onClick: props.onCancel,
        color: merged.cancelColor,
        variant: merged.cancelVariant,
      },
      cn({
        [mergedClasses.cancelButton ?? ""]: true,
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
