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
  getAccordionTriggerId,
  normalizeAccordionValue,
  toggleAccordionItem,
  type AccordionValue,
} from "@bridge-ui/core/Domain";
import {
  accordionColorProps as colorProps,
  accordionSizeProps as sizeProps,
  accordionVariantProps as variantProps,
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
  AccordionEmits,
  AccordionOwnProps,
  AccordionProps,
} from "@/Components/Accordion/accordion.types";
import {
  ACCORDION_INJECTION_KEY,
  type AccordionContextValue,
} from "@/Components/Accordion/accordionInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const accordionBridgeKeys = [
  "size",
  "color",
  "classes",
  "variant",
  "disabled",
  "multiple",
  "customProps",
] as const satisfies readonly (keyof AccordionOwnProps)[];

type AccordionLibDefaults = LibDefaultsShape<
  AccordionOwnProps,
  "size" | "color" | "variant" | "disabled" | "multiple"
>;

type AccordionMerged = MergeLibDefaults<
  AccordionOwnProps,
  AccordionLibDefaults
>;

export function useAccordion(
  props: AccordionOwnProps,
  libDefaults: AccordionLibDefaults,
  model: Ref<undefined | AccordionValue>,
  emit: SetupContext<AccordionEmits>["emit"],
) {
  const vueId = useId();
  const attrs = useAttrs();
  const accordionId = `bridge-accordion${vueId}`;

  const itemValues = ref<string[]>([]);
  const disabledValues = ref<string[]>([]);

  const split = computed(() => {
    return splitComponentProps<AccordionProps, typeof accordionBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: accordionBridgeKeys,
    });
  });

  const { merged, entry: bridgeAccordion } = useBridgeUIComponent<
    AccordionMerged,
    "Accordion"
  >({
    libDefaults,
    componentName: "Accordion",
    props: () => split.value.componentProps,
  });

  const multiple = computed(() => {
    return merged.value.multiple === true;
  });

  const expanded = computed(() => {
    return normalizeAccordionValue(model.value, multiple.value);
  });

  function toggleItem(value: string) {
    if (merged.value.disabled || disabledValues.value.includes(value)) {
      return;
    }

    const next = toggleAccordionItem(expanded.value, value, multiple.value);

    model.value = next;
    emit("update:modelValue", next);
    emit("change", next);
  }

  function registerItem(value: string, disabled = false) {
    if (!itemValues.value.includes(value)) {
      itemValues.value = [...itemValues.value, value];
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

    return () => {
      itemValues.value = itemValues.value.filter((item) => item !== value);
      disabledValues.value = disabledValues.value.filter(
        (item) => item !== value,
      );
    };
  }

  function focusTrigger(value: string) {
    document.getElementById(getAccordionTriggerId(accordionId, value))?.focus();
  }

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeAccordion,
    props: () => split.value.componentProps,
  });

  const sizeClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeAccordion.value?.tokens?.size,
    );
  });

  const variantClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeAccordion.value?.tokens?.variant,
    );
  });

  const colorClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      colorProps,
      bridgeAccordion.value?.tokens?.color,
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

  const contextValue = computed((): AccordionContextValue => {
    return {
      toggleItem,
      registerItem,
      focusTrigger,
      id: accordionId,
      multiple: multiple.value,
      expanded: expanded.value,
      itemValues: itemValues.value,
      disabledValues: disabledValues.value,
      disabled: merged.value.disabled === true,
      tokenClasses: {
        rootSize: get(sizeItem.value, "root"),
        itemSize: get(sizeItem.value, "item"),
        iconSize: get(sizeItem.value, "icon"),
        panelSize: get(sizeItem.value, "panel"),
        triggerSize: get(sizeItem.value, "trigger"),
        rootVariant: get(variantItem.value, "root"),
        itemVariant: get(variantItem.value, "item"),
        triggerVariant: get(variantItem.value, "trigger"),
        colorIndicator: get(colorItem.value, "indicator"),
        colorTriggerExpanded: get(colorItem.value, "triggerExpanded"),
      },
    };
  });

  provide(ACCORDION_INJECTION_KEY, contextValue);

  const rootBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.root,
      split.value.inheritedAttrs,
      {
        class: cn({
          [get(sizeItem.value, "root") ?? ""]: true,
          [get(variantItem.value, "root") ?? ""]: true,
          [get(mergedClasses.value, "root") ?? ""]: true,
        }),
      },
    );
  });

  return {
    merged,
    rootBind,
    contextValue,
  };
}
