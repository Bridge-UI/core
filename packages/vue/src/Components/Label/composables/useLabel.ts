// ** External Imports
import { get } from "es-toolkit/compat";
import { computed } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";
import { sizeProps, type LabelSize } from "@bridge-ui/core/Components/Label";

// ** Local Imports
import type { LabelOwnProps } from "@/Components/Label/label.types";
import { mergePartBind } from "@/Utils";

export function useLabel(props: LabelOwnProps, attrs: Record<string, unknown>) {
  const showRequired = computed(() => {
    return Boolean(props.required);
  });

  const sizeKey = computed(() => {
    return (props.size ?? "md") as keyof LabelSize;
  });

  const rootClass = computed(() => {
    return cn(
      "inline-flex items-center gap-x-0.5 font-medium leading-none",
      { "text-error-600 dark:text-error-400": props.error },
      { "text-gray-700 dark:text-gray-300": !props.error },
      get(sizeProps, sizeKey.value),
      props.classes?.root,
      props.class,
    );
  });

  const requiredClass = computed(() => {
    return cn(
      "text-error-500 dark:text-error-500 select-none",
      props.classes?.required,
    );
  });

  const rootBind = computed(() => {
    return mergePartBind(
      {
        ...attrs,
        ...(props.for ? { for: props.for } : {}),
      },
      rootClass.value,
    );
  });

  const requiredBind = computed(() => {
    return { class: requiredClass.value, "aria-hidden": true as const };
  });

  return {
    rootBind,
    requiredBind,
    showRequired,
  };
}
