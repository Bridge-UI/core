// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  computed,
  toValue,
  useAttrs,
  useId,
  useSlots,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type MaybeRefOrGetter,
} from "vue";

// ** Core Imports
import { labelSizeProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  FormControlClasses,
  FormControlOwnProps,
} from "@/Components/FormControl/formControl.types";
import type { LabelProps } from "@/Components/Label/label.types";
import {
  hasSlotOrProp,
  mergeNestedComponentProps,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export const formControlBridgeKeys = [
  "size",
  "error",
  "classes",
  "disabled",
  "endLabel",
  "readonly",
  "required",
  "controlId",
  "startLabel",
  "customProps",
  "description",
  "errorMessage",
  "hideErrorMessage",
] as const satisfies readonly (keyof FormControlOwnProps)[];

type FormControlLibDefaults = LibDefaultsShape<
  FormControlOwnProps,
  "size" | "error" | "hideErrorMessage"
>;

type FormControlMerged = MergeLibDefaults<
  FormControlOwnProps,
  FormControlLibDefaults
>;

/**
 * Options for {@link useFormControl}.
 */
export type FormControlOptions = {
  /**
   * Public registry key that owns FormControl chrome defaults/tokens.
   * Defaults to `FormControl`; Checkbox / Radio / Switch pass their own key
   * so chrome cascades (`FormControl` → parent).
   */
  componentName?: "Radio" | "Switch" | "Checkbox" | "FormControl";
};

export function useFormControl(
  props: MaybeRefOrGetter<Omit<FormControlOwnProps, "field">>,
  libDefaults: FormControlLibDefaults,
  options: FormControlOptions = {},
) {
  const autoId = useId();
  const slots = useSlots();
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<
      Omit<FormControlOwnProps, "field">,
      typeof formControlBridgeKeys
    >({
      bridgeKeys: formControlBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const {
    merged,
    entry: bridgeFormControl,
    chromeEntry: bridgeFormControlChrome,
  } = useBridgeUIComponent<
    FormControlMerged,
    NonNullable<FormControlOptions["componentName"]>
  >({
    libDefaults,
    componentName: options.componentName ?? "FormControl",
    props: () => {
      return split.value.componentProps;
    },
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<FormControlClasses>({
    entry: bridgeFormControl,
    chromeEntry: bridgeFormControlChrome,
    props: () => split.value.componentProps,
  });

  const invalidated = computed(() => {
    return merged.value.error === true;
  });

  const isDisabled = computed(() => {
    return Boolean(merged.value.disabled);
  });

  const isReadonly = computed(() => {
    return Boolean(merged.value.readonly);
  });

  const controlId = computed(() => {
    const inheritedId = (split.value.inheritedAttrs as HTMLAttributes).id;

    return merged.value.controlId ?? inheritedId ?? autoId;
  });

  const reservesErrorMessageSpace = computed(() => {
    return !merged.value.hideErrorMessage;
  });

  const showErrorMessageContent = computed(() => {
    return (
      invalidated.value &&
      hasSlotOrProp(slots, "errorMessage", merged.value.errorMessage)
    );
  });

  const ariaDescribedBy = computed(() => {
    const ids: string[] = [];

    if (
      !invalidated.value &&
      hasSlotOrProp(slots, "description", merged.value.description)
    ) {
      ids.push(`${controlId.value}-description`);
    }

    if (
      invalidated.value &&
      reservesErrorMessageSpace.value &&
      hasSlotOrProp(slots, "errorMessage", merged.value.errorMessage)
    ) {
      ids.push(`${controlId.value}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  const textSizeClass = computed(() => {
    return get(labelSizeProps, merged.value.size ?? "md");
  });

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      omit(split.value.inheritedAttrs, ["class"]),
      cn({
        "group/form-control relative w-full": true,
        "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60 aria-disabled:cursor-not-allowed": true,
        "aria-readonly:pointer-events-none aria-readonly:select-none": true,
        [mergedClasses.value.root ?? ""]: true,
        [attrs.class as string]: Boolean(attrs.class),
      }),
    );
  });

  const rowBind = computed(() => {
    return mergePartBind(
      customProps.value?.row,
      {},
      cn({
        "flex flex-row items-center gap-x-2": true,
        [mergedClasses.value.row ?? ""]: true,
      }),
    );
  });

  const fieldLabelProps = computed(() => {
    const buildLabelProps = (part: "endLabel" | "startLabel"): LabelProps => {
      return mergeNestedComponentProps(customProps.value?.[part], {
        for: controlId.value,
        size: merged.value.size,
        error: invalidated.value,
        required: merged.value.required,
        classes: {
          root: cn({
            "cursor-pointer": true,
            [mergedClasses.value[part] ?? ""]: true,
          }),
        },
      });
    };

    return {
      endLabel: buildLabelProps("endLabel"),
      startLabel: buildLabelProps("startLabel"),
    };
  });

  const descriptionBind = computed(() => {
    return mergePartBind(
      customProps.value?.description,
      { id: `${controlId.value}-description` },
      cn({
        "mt-2 text-dark-500 dark:text-dark-400": true,
        [textSizeClass.value ?? ""]: true,
        [mergedClasses.value.description ?? ""]: true,
      }),
    );
  });

  const errorMessageBind = computed(() => {
    return mergePartBind(
      customProps.value?.errorMessage,
      { id: `${controlId.value}-error` },
      cn({
        "mt-2": true,
        "min-h-[1lh]": reservesErrorMessageSpace.value,
        "text-error-600 dark:text-error-400": true,
        [textSizeClass.value ?? ""]: true,
        [mergedClasses.value.errorMessage ?? ""]: true,
      }),
    );
  });

  const controlBind = computed(() => {
    return {
      id: controlId.value,
      disabled: isDisabled.value,
      readonly: isReadonly.value,
      "aria-describedby": ariaDescribedBy.value,
      required: merged.value.required || undefined,
      "aria-invalid": invalidated.value || undefined,
    } satisfies Partial<InputHTMLAttributes>;
  });

  return {
    slots,
    merged,
    rowBind,
    rootBind,
    controlId,
    isDisabled,
    isReadonly,
    controlBind,
    invalidated,
    fieldLabelProps,
    descriptionBind,
    errorMessageBind,
    showErrorMessageContent,
    reservesErrorMessageSpace,
  };
}

export type UseFormControlReturn = ReturnType<typeof useFormControl>;
