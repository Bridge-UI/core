// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import {
  Comment,
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  Text,
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
  commitFreeSoloValue,
  createSelectAsyncSearch,
  filterListboxEntries,
  flattenListboxOptions,
  mergeBridgeUILayeredClasses,
  normalizeListboxEntries,
  normalizeSelectOptions,
  resolveMessage,
  resolveSelectAsyncDebounce,
  resolveSelectAsyncOptions,
  selectValuesEqual,
  splitComponentProps,
  type ListboxEntry,
  type SelectAsyncSearch,
} from "@bridge-ui/core";
import { colorProps, invalidatedProps } from "@bridge-ui/core/Tokens/Listbox";

// ** Local Imports
import { useI18nAdapter } from "@/Adapters/I18n";
import type {
  AutocompleteClasses,
  AutocompleteCustomProps,
  AutocompleteEmits,
  AutocompleteOwnProps,
  SelectOption,
  SelectValue,
} from "@/Components/Autocomplete/autocomplete.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/composables/useFormField";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import { useListboxNavigation } from "@/Components/Listbox/composables/useListboxNavigation";
import {
  hasNamedSlot,
  mergePartBind,
  resolveFieldAdornmentIconSize,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const autocompleteBridgeKeys = [
  "classes",
  "loading",
  "options",
  "freeSolo",
  "multiple",
  "asyncData",
  "clearable",
  "maxHeight",
  "searchable",
  "flipOptions",
  "optionLabel",
  "optionValue",
  "placeholder",
  "defaultValue",
  "emptyMessage",
  "loadingMessage",
  "disableMaxHeight",
  "hideEmptyMessage",
  "minItemsForSearch",
  "optionDescription",
] as const satisfies readonly (keyof AutocompleteOwnProps)[];

type AutocompleteRegistryProps = Pick<AutocompleteOwnProps, "classes">;

export function useAutocomplete(
  props: AutocompleteOwnProps,
  model: Ref<null | undefined | SelectValue | SelectValue[]>,
  triggerRef: Ref<null | HTMLInputElement | HTMLTextAreaElement>,
  emit: SetupContext<AutocompleteEmits>["emit"],
  declarativeOptions: Ref<SelectOption[]>,
) {
  const attrs = useAttrs();
  const slots = useSlots();
  const i18n = useI18nAdapter();
  const listboxId = useId();

  const open = ref(false);
  const searchQuery = ref("");
  const highlightedIndex = ref(-1);
  const containerRef = ref<null | HTMLElement>(null);

  const asyncLoading = ref(false);
  const asyncOptions = ref<SelectOption[]>([]);
  let asyncSearch: null | SelectAsyncSearch = null;
  const resolvedSelected = ref<SelectOption[]>([]);

  const split = computed(() => {
    return splitComponentProps<
      AutocompleteOwnProps & Record<string, unknown>,
      typeof autocompleteBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: autocompleteBridgeKeys,
    });
  });

  const autocompleteMerged = computed(() => {
    return split.value.componentProps;
  });

  const registryProps = computed((): AutocompleteRegistryProps => {
    return {
      classes: autocompleteMerged.value.classes,
    };
  });

  const { components, entry: bridgeAutocomplete } = useBridgeUIComponent<
    AutocompleteRegistryProps,
    "Autocomplete"
  >({
    componentName: "Autocomplete",
    props: () => registryProps.value,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<AutocompleteClasses>({
    entry: bridgeAutocomplete,
    props: () => registryProps.value,
  });

  const multiple = computed(() => {
    return Boolean(autocompleteMerged.value.multiple);
  });

  const optionKeys = computed(() => {
    return {
      optionLabel: autocompleteMerged.value.optionLabel ?? "label",
      optionValue: autocompleteMerged.value.optionValue ?? "value",
      optionDescription:
        autocompleteMerged.value.optionDescription ?? "description",
    };
  });

  const staticEntries = computed(() => {
    if (declarativeOptions.value.length > 0) {
      return declarativeOptions.value.map((option) => ({
        option,
        type: "option" as const,
      }));
    }

    return normalizeListboxEntries(
      autocompleteMerged.value.options,
      optionKeys.value,
    );
  });

  const staticOptions = computed(() => {
    return flattenListboxOptions(staticEntries.value);
  });

  const registeredOptions = ref<SelectOption[]>([]);

  function isSelectOptionNode(node: unknown): boolean {
    if (!node || typeof node !== "object") {
      return false;
    }

    const type = (node as { type?: unknown }).type;

    if (!type || typeof type !== "object") {
      return false;
    }

    const name = (type as { __name?: string; name?: string }).name;
    const scriptName = (type as { __name?: string }).__name;

    return name === "AutocompleteOption" || scriptName === "AutocompleteOption";
  }

  function defaultSlotIsComposedList() {
    if (!hasNamedSlot(slots, "default")) {
      return false;
    }

    const nodes = slots.default?.({}) ?? [];

    return nodes.some((node) => {
      if (!node || typeof node !== "object") {
        return false;
      }

      const type = (node as { type?: unknown }).type;

      if (type === Comment || type === Text || type === undefined) {
        return false;
      }

      if (typeof type === "symbol") {
        return false;
      }

      return !isSelectOptionNode(node);
    });
  }

  const hasComposedList = computed(() => {
    return (
      defaultSlotIsComposedList() && !autocompleteMerged.value.options?.length
    );
  });

  const resolvedEntries = computed((): ListboxEntry[] => {
    if (hasComposedList.value) {
      return [];
    }

    if (asyncOptions.value.length > 0) {
      const asyncEntries = normalizeListboxEntries(
        asyncOptions.value,
        optionKeys.value,
      );

      if (autocompleteMerged.value.flipOptions) {
        return [...asyncEntries].reverse();
      }

      return asyncEntries;
    }

    if (autocompleteMerged.value.flipOptions) {
      return [...staticEntries.value].reverse().map((entry) => {
        if (entry.type === "section") {
          return { ...entry, options: [...entry.options].reverse() };
        }

        return entry;
      });
    }

    return staticEntries.value;
  });

  const resolvedOptions = computed(() => {
    if (hasComposedList.value) {
      return registeredOptions.value;
    }

    return flattenListboxOptions(resolvedEntries.value);
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
    return autocompleteMerged.value.clearable !== false;
  });

  const isAsync = computed(() => {
    return Boolean(autocompleteMerged.value.asyncData);
  });

  const isSearchEnabled = computed(() => {
    if (isAsync.value || (autocompleteMerged.value.searchable ?? true)) {
      return true;
    }

    const min = autocompleteMerged.value.minItemsForSearch ?? 11;

    return staticOptions.value.length >= min;
  });

  const isSearchActive = computed(() => {
    return open.value && isSearchEnabled.value;
  });

  const isLoading = computed(() => {
    return Boolean(autocompleteMerged.value.loading) || asyncLoading.value;
  });

  const visibleEntries = computed(() => {
    if (hasComposedList.value) {
      return [];
    }

    if (!isSearchActive.value || !searchQuery.value.trim()) {
      return resolvedEntries.value;
    }

    const query = searchQuery.value.trim().toLowerCase();

    return filterListboxEntries(resolvedEntries.value, (option) => {
      return option.label.toLowerCase().includes(query);
    });
  });

  const visibleOptions = computed(() => {
    if (hasComposedList.value) {
      return registeredOptions.value;
    }

    return flattenListboxOptions(visibleEntries.value);
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

  const handleContainerRef = (element: null | Element) => {
    containerRef.value = element instanceof HTMLElement ? element : null;
  };

  function handleClearPointer(event: MouseEvent) {
    event.preventDefault();
  }

  function handleTriggerPointer(event: MouseEvent) {
    if (props.disabled || props.readonly) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest("[data-autocomplete-clear]")) {
      return;
    }

    if (
      target.closest(".wrapper-start-slot") ||
      target.closest(".wrapper-end-slot")
    ) {
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
    }).componentProps;

    const endIcon =
      formFieldCustom.endIcon ??
      (hasNamedSlot(slots, "end") ? undefined : "chevronUpDown");

    const { listbox: _listbox, ...formFieldOnlyCustom } =
      (formFieldCustom.customProps ?? {}) as AutocompleteCustomProps;

    return {
      ...formFieldCustom,
      endIcon,
      classes: mergedClasses.value,
      customProps: {
        ...formFieldOnlyCustom,
        container: mergePartBind(
          formFieldOnlyCustom.container,
          {},
          {
            ref: handleContainerRef,
            onClick: handleTriggerPointer,
            class: cn({
              "cursor-pointer":
                !props.disabled && !props.readonly && !isSearchActive.value,
            }),
          },
        ),
      },
    };
  });

  const listboxCustomProps = computed(() => {
    return props.customProps?.listbox;
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

  const adjustHeight = (element: null | HTMLTextAreaElement) => {
    if (!element || !multiple.value) {
      return;
    }

    adjustAutosizeTextareaHeight(element);
  };

  function isSelected(value: SelectValue) {
    return selectedValues.value.some((item) => selectValuesEqual(item, value));
  }

  function setModel(next: null | undefined | SelectValue | SelectValue[]) {
    model.value = next as typeof model.value;
  }

  function emitChange(next: null | undefined | SelectValue | SelectValue[]) {
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

    if (isAsync.value && autocompleteMerged.value.asyncData) {
      asyncSearch?.searchImmediate("");
    }
  }

  function closeMenu(options?: { commitFreeSolo?: boolean }) {
    asyncSearch?.cancel();

    const wasOpen = open.value;

    if (
      wasOpen &&
      options?.commitFreeSolo &&
      autocompleteMerged.value.freeSolo !== false
    ) {
      const next = commitFreeSoloValue(
        searchQuery.value,
        selectedValues.value,
        multiple.value,
      );

      if (next != null) {
        setModel(next);
        emitChange(next);

        if (multiple.value) {
          void nextTick(() => {
            adjustHeight(triggerRef.value as HTMLTextAreaElement);
            triggerRef.value?.focus({ preventScroll: true });
          });
        }
      }
    }

    searchQuery.value = "";
    highlightedIndex.value = -1;

    if (!wasOpen) {
      return;
    }

    open.value = false;
    emit("close");
  }

  function selectOption(option: SelectOption) {
    if (option.disabled) {
      return;
    }

    if (multiple.value) {
      const current = [...selectedValues.value];
      const index = current.findIndex((value) =>
        selectValuesEqual(value, option.value),
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

  function commitFreeSolo() {
    if (autocompleteMerged.value.freeSolo === false) {
      return false;
    }

    const next = commitFreeSoloValue(
      searchQuery.value,
      selectedValues.value,
      multiple.value,
    );

    if (next == null) {
      return false;
    }

    setModel(next);
    emitChange(next);
    searchQuery.value = "";
    highlightedIndex.value = -1;

    if (multiple.value) {
      void nextTick(() => {
        adjustHeight(triggerRef.value as HTMLTextAreaElement);
        triggerRef.value?.focus({ preventScroll: true });
      });

      return true;
    }

    closeMenu();

    return true;
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
      (value) => !selectValuesEqual(value, option.value),
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

      return true;
    }

    return false;
  }

  function handleTriggerInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;

    searchQuery.value = target.value;
    emit("search", searchQuery.value);

    if (!open.value) {
      openMenu();
    }

    navigation.resetHighlight();

    if (isAsync.value) {
      asyncSearch?.searchDebounced(searchQuery.value);
    }
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
        } else if (!selectHighlighted()) {
          commitFreeSolo();
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
        closeMenu({ commitFreeSolo: true });
        break;
      default:
        break;
    }
  }

  async function fetchAsyncOptions(query: string) {
    const asyncData = autocompleteMerged.value.asyncData;

    if (!asyncData) {
      return;
    }

    asyncLoading.value = true;

    try {
      const { options, resolvedSelected: resolved } =
        await resolveSelectAsyncOptions(
          asyncData,
          query,
          selectedValues.value,
          (items) => normalizeSelectOptions(items, optionKeys.value),
        );

      if (resolved.length > 0) {
        resolvedSelected.value = resolved;
      }

      asyncOptions.value = options;
    } finally {
      asyncLoading.value = false;
    }
  }

  async function resolveSelectedOptions() {
    const asyncData = autocompleteMerged.value.asyncData;

    if (!asyncData?.resolve || selectedValues.value.length === 0) {
      return;
    }

    resolvedSelected.value = normalizeSelectOptions(
      await asyncData.resolve(selectedValues.value),
      optionKeys.value,
    );
  }

  const listboxPalette = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      get(components.value, ["Listbox", "tokens", "color"]),
    );
    const base = get(classes, formField.merged.value.color ?? "primary");

    if (!formField.invalidated.value) {
      return base;
    }

    return mergeBridgeUILayeredClasses(
      invalidatedProps,
      get(components.value, ["Listbox", "tokens", "invalidated"]),
    );
  });

  const selectedValueTextClass = computed(() => {
    return listboxPalette.value?.value;
  });

  const triggerBind = computed(() => {
    const showPointerCursor =
      !props.disabled && !props.readonly && !isSearchActive.value;

    const showTextCursor =
      !props.disabled &&
      !props.readonly &&
      isSearchActive.value &&
      isSearchEnabled.value;

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
        placeholder: autocompleteMerged.value.placeholder,
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
        "cursor-text": showTextCursor,
        "cursor-pointer": showPointerCursor,
        "resize-none overflow-hidden": multiple.value,
        [cn(selectedValueTextClass.value, mergedClasses.value.value) ?? ""]:
          showSelectedValueStyle,
      }),
    );
  });

  watch(
    () => [open.value, multiple.value, triggerRef.value] as const,
    () => {
      adjustHeight(triggerRef.value as null | HTMLTextAreaElement);
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
    () => autocompleteMerged.value.asyncData,
    (asyncData) => {
      asyncSearch?.cancel();
      asyncOptions.value = [];
      void resolveSelectedOptions();

      if (!asyncData) {
        asyncSearch = null;
        return;
      }

      asyncSearch = createSelectAsyncSearch(
        (query) => void fetchAsyncOptions(query),
        resolveSelectAsyncDebounce(asyncData),
      );
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    asyncSearch?.cancel();
  });

  onMounted(() => {
    adjustHeight(triggerRef.value as null | HTMLTextAreaElement);
  });

  const clearIconSize = computed(() => {
    return resolveFieldAdornmentIconSize(formField.merged.value.size);
  });

  const clearBind = computed(() => {
    return mergePartBind(
      {},
      {},
      {
        tabindex: 0,
        role: "button",
        "data-autocomplete-clear": true,
        onMousedown: handleClearPointer,
        class: cn({
          "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors duration-150": true,
          [listboxPalette.value?.clear ?? ""]: true,
          [mergedClasses.value.clear ?? ""]: true,
        }),
      },
    );
  });

  const listboxProps = computed(() => {
    return {
      listboxId,
      isSelected,
      disableAutoFocus: true,
      loading: isLoading.value,
      multiple: multiple.value,
      maxHeight: props.maxHeight,
      entries: visibleEntries.value,
      options: visibleOptions.value,
      size: formField.merged.value.size,
      color: formField.merged.value.color,
      labelledBy: formField.controlId.value,
      rounded: formField.merged.value.rounded,
      invalidated: formField.invalidated.value,
      highlightedIndex: highlightedIndex.value,
      disableMaxHeight: props.disableMaxHeight === true,
      hideEmptyMessage: autocompleteMerged.value.hideEmptyMessage === true,
      emptyMessage:
        autocompleteMerged.value.emptyMessage ??
        resolveMessage("No options", i18n.value),
      loadingMessage:
        autocompleteMerged.value.loadingMessage ??
        resolveMessage("Loading...", i18n.value),
      ...listboxCustomProps.value,
    };
  });

  function handleRegisteredOptionsChange(options: SelectOption[]) {
    const current = registeredOptions.value;

    if (
      current.length === options.length &&
      current.every(
        (option, index) =>
          String(option.value) === String(options[index]?.value),
      )
    ) {
      return;
    }

    registeredOptions.value = options;
  }

  const openModel = computed({
    get: () => open.value,
    set: (next: boolean) => {
      if (next) {
        openMenu();
      } else {
        closeMenu({ commitFreeSolo: true });
      }
    },
  });

  return {
    slots,
    hasValue,
    multiple,
    listboxId,
    formField,
    isLoading,
    clearable,
    clearBind,
    isSelected,
    clearValue,
    removeChip,
    triggerBind,
    selectOption,
    containerRef,
    listboxProps,
    clearIconSize,
    mergedClasses,
    visibleOptions,
    isSearchActive,
    open: openModel,
    selectedOptions,
    hasComposedList,
    highlightedIndex,
    handleRegisteredOptionsChange,
    hideEmptyMessage: computed(() => {
      return autocompleteMerged.value.hideEmptyMessage === true;
    }),
    emptyMessage: computed(() => {
      return (
        autocompleteMerged.value.emptyMessage ??
        resolveMessage("No options", i18n.value)
      );
    }),
    loadingMessage: computed(() => {
      return (
        autocompleteMerged.value.loadingMessage ??
        resolveMessage("Loading...", i18n.value)
      );
    }),
  };
}
