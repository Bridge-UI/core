// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { ChevronsUpDown } from "lucide-vue-next";
import {
  computed,
  nextTick,
  onMounted,
  ref,
  useAttrs,
  useId,
  useSlots,
  watch,
  type Ref,
  type SetupContext,
} from "vue";

// ** Core Imports
import {
  adjustAutosizeTextareaHeight,
  cn,
  splitComponentProps,
} from "@bridge-ui/core";
import { colorProps } from "@bridge-ui/core/Components/Listbox";

// ** Local Imports
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/composables/useFormField";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import { useListboxNavigation } from "@/Components/Listbox/composables/useListboxNavigation";
import type {
  SelectClasses,
  SelectEmits,
  SelectOption,
  SelectOptionInput,
  SelectOptionLike,
  SelectOwnProps,
  SelectValue,
} from "@/Components/Select/select.types";
import {
  hasNamedSlot,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const selectBridgeKeys = [
  "classes",
  "loading",
  "options",
  "multiple",
  "asyncData",
  "clearable",
  "searchable",
  "flipOptions",
  "placeholder",
  "optionLabel",
  "optionValue",
  "emptyMessage",
  "defaultValue",
  "hideEmptyMessage",
  "minItemsForSearch",
  "optionDescription",
] as const satisfies readonly (keyof SelectOwnProps)[];

type SelectRegistryProps = Pick<SelectOwnProps, "classes">;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeOption(
  item: SelectOptionInput,
  keys: {
    optionDescription: string;
    optionLabel: string;
    optionValue: string;
  },
): SelectOption {
  if (typeof item === "string" || typeof item === "number") {
    const label = String(item);

    return { label, value: item };
  }

  if (isRecord(item) && "label" in item && "value" in item) {
    return {
      raw: item,
      label: String(item.label),
      value: item.value as SelectValue,
      disabled: Boolean(item.disabled),
      description: item.description ? String(item.description) : undefined,
    };
  }

  if (isRecord(item)) {
    const label = String(get(item, keys.optionLabel, ""));
    const description = get(item, keys.optionDescription);
    const value = get(item, keys.optionValue) as SelectValue;

    return {
      label,
      value,
      raw: item,
      disabled: Boolean(get(item, "disabled", false)),
      description: isNil(description) ? undefined : String(description),
    };
  }

  return { label: "", value: "" };
}

function normalizeOptions(
  options: SelectOptionInput[] | undefined,
  keys: {
    optionDescription: string;
    optionLabel: string;
    optionValue: string;
  },
): SelectOption[] {
  if (!options?.length) {
    return [];
  }

  return options.map((item) => normalizeOption(item, keys));
}

function normalizeAsyncOptions(
  items: SelectOptionLike[],
  keys: {
    optionDescription: string;
    optionLabel: string;
    optionValue: string;
  },
): SelectOption[] {
  return items.map((item) => normalizeOption(item as SelectOptionInput, keys));
}

function valuesEqual(a: SelectValue, b: SelectValue) {
  return String(a) === String(b);
}

export function useSelect(
  props: SelectOwnProps,
  model: Ref<SelectValue | SelectValue[] | null | undefined>,
  triggerRef: Ref<HTMLInputElement | HTMLTextAreaElement | null>,
  emit: SetupContext<SelectEmits>["emit"],
  declarativeOptions: Ref<SelectOption[]>,
) {
  const attrs = useAttrs();
  const slots = useSlots();
  const listboxId = useId();

  const open = ref(false);
  const searchQuery = ref("");
  const highlightedIndex = ref(-1);
  const containerRef = ref<HTMLElement | null>(null);

  const asyncLoading = ref(false);
  const asyncOptions = ref<SelectOption[]>([]);
  const resolvedSelected = ref<SelectOption[]>([]);

  const split = computed(() => {
    return splitComponentProps<
      SelectOwnProps & Record<string, unknown>,
      typeof selectBridgeKeys
    >({
      bridgeKeys: selectBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const selectMerged = computed(() => {
    return split.value.customProps;
  });

  const registryProps = computed((): SelectRegistryProps => {
    return {
      classes: selectMerged.value.classes,
    };
  });

  const { entry: bridgeSelect } = useBridgeUIComponent<
    SelectRegistryProps,
    "Select"
  >({
    componentName: "Select",
    props: () => registryProps.value,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<SelectClasses>({
    entry: bridgeSelect,
    props: () => registryProps.value,
  });

  const multiple = computed(() => Boolean(selectMerged.value.multiple));

  const optionKeys = computed(() => {
    return {
      optionLabel: selectMerged.value.optionLabel ?? "label",
      optionValue: selectMerged.value.optionValue ?? "value",
      optionDescription: selectMerged.value.optionDescription ?? "description",
    };
  });

  const staticOptions = computed(() => {
    if (declarativeOptions.value.length > 0) {
      return declarativeOptions.value;
    }

    return normalizeOptions(selectMerged.value.options, optionKeys.value);
  });

  const resolvedOptions = computed(() => {
    const base =
      asyncOptions.value.length > 0 ? asyncOptions.value : staticOptions.value;

    if (selectMerged.value.flipOptions) {
      return [...base].reverse();
    }

    return base;
  });

  const selectedValues = computed((): SelectValue[] => {
    const value = model.value;

    if (multiple.value) {
      return Array.isArray(value) ? value : [];
    }

    return !isNil(value) && value !== "" ? [value as SelectValue] : [];
  });

  const selectedOptions = computed(() => {
    const map = new Map<SelectValue, SelectOption>();

    for (const option of [
      ...resolvedOptions.value,
      ...resolvedSelected.value,
    ]) {
      map.set(option.value, option);
    }

    return selectedValues.value.map((value) => {
      return (
        map.get(value) ?? {
          value,
          label: String(value),
        }
      );
    });
  });

  const hasValue = computed(() => {
    return selectedValues.value.length > 0;
  });

  const clearable = computed(() => {
    return selectMerged.value.clearable !== false;
  });

  const isAsync = computed(() => {
    return Boolean(selectMerged.value.asyncData);
  });

  const isSearchEnabled = computed(() => {
    if (isAsync.value || selectMerged.value.searchable) {
      return true;
    }

    const min = selectMerged.value.minItemsForSearch ?? 11;

    return staticOptions.value.length >= min;
  });

  const isSearchActive = computed(() => {
    return open.value && isSearchEnabled.value;
  });

  const isLoading = computed(() => {
    return Boolean(selectMerged.value.loading) || asyncLoading.value;
  });

  const visibleOptions = computed(() => {
    if (!isSearchActive.value || !searchQuery.value.trim()) {
      return resolvedOptions.value;
    }

    const query = searchQuery.value.trim().toLowerCase();

    return resolvedOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(query);
    });
  });

  const navigation = useListboxNavigation(
    () => visibleOptions.value,
    highlightedIndex,
    listboxId,
  );

  const triggerReadonly = computed(() => {
    if (props.readonly || props.disabled) {
      return true;
    }

    return !isSearchActive.value;
  });

  const displayValue = computed(() => {
    if (isSearchActive.value) {
      return searchQuery.value;
    }

    if (multiple.value) {
      return searchQuery.value;
    }

    return selectedOptions.value[0]?.label ?? "";
  });

  const handleContainerRef = (element: Element | null) => {
    containerRef.value = element instanceof HTMLElement ? element : null;
  };

  function handleTriggerPointer(event: MouseEvent) {
    if (props.disabled || props.readonly) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest("[data-select-clear]")) {
      return;
    }

    if (!open.value) {
      openMenu();
      return;
    }

    if (!isSearchActive.value) {
      closeMenu();
      triggerRef.value?.focus({ preventScroll: true });
    }
  }

  const formFieldInput = computed((): Omit<FormFieldOwnProps, "field"> => {
    const inherited = omit(split.value.inheritedAttrs, ["class"]);

    const formFieldCustom = splitComponentProps<
      Omit<FormFieldOwnProps, "field">,
      typeof formFieldBridgeKeys
    >({
      bridgeKeys: formFieldBridgeKeys,
      props: inherited as Omit<FormFieldOwnProps, "field">,
    }).customProps;

    const endIcon =
      formFieldCustom.endIcon ??
      (hasNamedSlot(slots, "end") ? undefined : ChevronsUpDown);

    return {
      ...formFieldCustom,
      endIcon,
      classes: mergedClasses.value,
      partsProps: {
        ...formFieldCustom.partsProps,
        container: mergePartBind(
          formFieldCustom.partsProps?.container,
          {},
          {
            ref: handleContainerRef,
            onClick: handleTriggerPointer,
          },
        ),
      },
    };
  });

  const formField = useFormField(
    () => formFieldInput.value,
    {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      withErrorIcon: true,
    },
    {
      likeInput: () => multiple.value,
      control: () => (multiple.value ? "textarea" : "input"),
    },
  );

  const adjustHeight = (element: HTMLTextAreaElement | null) => {
    if (!element || !multiple.value) {
      return;
    }

    adjustAutosizeTextareaHeight(element);
  };

  function isSelected(value: SelectValue) {
    return selectedValues.value.some((item) => valuesEqual(item, value));
  }

  function setModel(next: SelectValue | SelectValue[] | null | undefined) {
    model.value = next as typeof model.value;
  }

  function emitChange(next: SelectValue | SelectValue[] | null | undefined) {
    if (multiple.value) {
      const value = Array.isArray(next) ? next : [];
      emit("update:modelValue", value);
      emit("change", value);

      return;
    }

    const value = (next ?? "") as SelectValue;
    emit("update:modelValue", value);
    emit("change", value);
  }

  function openMenu() {
    if (props.disabled || props.readonly || open.value) {
      return;
    }

    open.value = true;
    searchQuery.value = "";
    navigation.highlightCurrentSelection(isSelected);
    emit("open");
    void fetchAsyncOptions("");
  }

  function closeMenu() {
    if (!open.value) {
      return;
    }

    open.value = false;
    searchQuery.value = "";
    highlightedIndex.value = -1;
    emit("close");
  }

  function selectOption(option: SelectOption) {
    if (option.disabled) {
      return;
    }

    if (multiple.value) {
      const current = [...selectedValues.value];
      const index = current.findIndex((value) =>
        valuesEqual(value, option.value),
      );

      if (index >= 0) {
        current.splice(index, 1);
        emit("deselect", option);
      } else {
        current.push(option.value);
        emit("select", option);
      }

      setModel(current);
      emitChange(current);
      searchQuery.value = "";
      highlightedIndex.value = -1;
      void nextTick(() => {
        adjustHeight(triggerRef.value as HTMLTextAreaElement);
        triggerRef.value?.focus({ preventScroll: true });
      });

      return;
    }

    setModel(option.value);
    emitChange(option.value);
    emit("select", option);
    closeMenu();
  }

  function clearValue(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (multiple.value) {
      setModel([]);
      emitChange([]);
    } else {
      setModel(null);
      emitChange(null);
    }

    emit("clear");
    closeMenu();
  }

  function removeChip(option: SelectOption, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (!multiple.value) {
      return;
    }

    const current = selectedValues.value.filter(
      (value) => !valuesEqual(value, option.value),
    );

    setModel(current);
    emitChange(current);
    emit("deselect", option);
    void nextTick(() => adjustHeight(triggerRef.value as HTMLTextAreaElement));
  }

  function selectHighlighted() {
    const option = navigation.getHighlightedOption();

    if (option) {
      selectOption(option);
    }
  }

  function handleTriggerInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;

    searchQuery.value = target.value;
    emit("search", searchQuery.value);

    if (!open.value) {
      openMenu();
    }

    navigation.resetHighlight();

    void fetchAsyncOptions(searchQuery.value);
  }

  function handleTriggerKeyDown(event: KeyboardEvent) {
    if (props.disabled || props.readonly) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        if (!open.value) {
          openMenu();
        } else {
          navigation.moveHighlight(1);
        }

        break;
      case "ArrowUp":
        event.preventDefault();

        if (!open.value) {
          openMenu();
        } else {
          navigation.moveHighlight(-1);
        }

        break;
      case "Enter":
        event.preventDefault();

        if (!open.value) {
          openMenu();
        } else {
          selectHighlighted();
        }

        break;
      case "Escape":
        event.preventDefault();
        closeMenu();
        break;
      case "Home":
        if (open.value) {
          event.preventDefault();
          navigation.highlightFirst();
        }

        break;
      case "End":
        if (open.value) {
          event.preventDefault();
          navigation.highlightLast();
        }

        break;
      case "Backspace":
        if (
          multiple.value &&
          !searchQuery.value &&
          selectedOptions.value.length > 0
        ) {
          event.preventDefault();
          const last = selectedOptions.value.at(-1);

          if (last) {
            removeChip(last, event);
          }
        }

        break;
      case "Tab":
        closeMenu();
        break;
      default:
        break;
    }
  }

  async function fetchAsyncOptions(query: string) {
    const asyncData = selectMerged.value.asyncData;

    if (!asyncData || typeof asyncData === "string") {
      return;
    }

    if ("search" in asyncData) {
      asyncLoading.value = true;

      try {
        const results = await asyncData.search(query, {
          selected: selectedValues.value,
        });

        asyncOptions.value = normalizeAsyncOptions(results, optionKeys.value);
      } finally {
        asyncLoading.value = false;
      }

      return;
    }

    if (!("url" in asyncData)) {
      return;
    }

    asyncLoading.value = true;

    try {
      const url = new URL(asyncData.url, window.location.origin);
      url.searchParams.set("search", query);
      url.searchParams.set("selected", JSON.stringify(selectedValues.value));

      const response = await fetch(url.toString(), {
        method: asyncData.method ?? "GET",
        credentials: asyncData.credentials,
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as SelectOptionLike[];
      asyncOptions.value = normalizeAsyncOptions(payload, optionKeys.value);
    } finally {
      asyncLoading.value = false;
    }
  }

  async function resolveSelectedOptions() {
    const asyncData = selectMerged.value.asyncData;

    if (
      !asyncData ||
      typeof asyncData === "string" ||
      !("resolveSelected" in asyncData) ||
      !asyncData.resolveSelected ||
      selectedValues.value.length === 0
    ) {
      return;
    }

    resolvedSelected.value = normalizeAsyncOptions(
      await asyncData.resolveSelected(selectedValues.value),
      optionKeys.value,
    );
  }

  const listboxColor = computed(() => {
    if (formField.invalidated.value) {
      return "error" as const;
    }

    return formField.merged.value.color ?? "primary";
  });

  const selectedValueTextClass = computed(() => {
    return get(colorProps, listboxColor.value)?.value;
  });

  const triggerBind = computed(() => {
    const showPointerCursor =
      !props.disabled && !props.readonly && !isSearchActive.value;

    const showSelectedValueStyle =
      hasValue.value && !multiple.value && !isSearchActive.value;

    return mergePartBind(
      {
        role: "combobox",
        value: displayValue.value,
        "aria-controls": listboxId,
        "aria-expanded": open.value,
        readonly: triggerReadonly.value,
        onKeydown: handleTriggerKeyDown,
        placeholder: selectMerged.value.placeholder,
        "aria-autocomplete": isSearchEnabled.value ? "list" : undefined,
        "aria-activedescendant": open.value
          ? navigation.activeDescendantId.value
          : undefined,
        ...(multiple.value
          ? {
              rows: 1,
              onInput: (event: Event) => {
                handleTriggerInput(event);
                adjustHeight(event.target as HTMLTextAreaElement);
              },
            }
          : {
              onInput: handleTriggerInput,
            }),
      },
      formField.inputBind.value,
      cn({
        "cursor-pointer": showPointerCursor,
        "overflow-hidden": multiple.value,
        [cn(selectedValueTextClass.value, mergedClasses.value.value) ?? ""]:
          showSelectedValueStyle,
      }),
    );
  });

  watch(
    () => [open.value, multiple.value, triggerRef.value] as const,
    () => {
      adjustHeight(triggerRef.value as HTMLTextAreaElement | null);
    },
    { immediate: true },
  );

  watch(
    () => model.value,
    () => {
      void resolveSelectedOptions();
    },
    { immediate: true },
  );

  watch(
    () => selectMerged.value.asyncData,
    () => {
      asyncOptions.value = [];
      void resolveSelectedOptions();
    },
  );

  onMounted(() => {
    adjustHeight(triggerRef.value as HTMLTextAreaElement | null);
  });

  return {
    open,
    slots,
    hasValue,
    multiple,
    listboxId,
    formField,
    isLoading,
    clearable,
    isSelected,
    clearValue,
    removeChip,
    triggerBind,
    listboxColor,
    selectOption,
    containerRef,
    visibleOptions,
    isSearchActive,
    selectedOptions,
    highlightedIndex,
    emptyMessage: computed(
      () => selectMerged.value.emptyMessage ?? "No options",
    ),
    hideEmptyMessage: computed(
      () => selectMerged.value.hideEmptyMessage === true,
    ),
  };
}
