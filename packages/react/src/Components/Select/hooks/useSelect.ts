// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { ChevronsUpDown } from "lucide-react";
import type { FormEvent, KeyboardEvent, MouseEvent, RefObject } from "react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

// ** Core Imports
import {
  adjustAutosizeTextareaHeight,
  cn,
  splitComponentProps,
} from "@bridge-ui/core";
import { colorProps } from "@bridge-ui/core/Components/Listbox";

// ** Local Imports
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/hooks/useFormField";
import {
  highlightCurrentSelection,
  useListboxNavigation,
} from "@/Components/Listbox/hooks/useListboxNavigation";
import type {
  SelectClasses,
  SelectOption,
  SelectOptionInput,
  SelectOptionLike,
  SelectOwnProps,
  SelectProps,
  SelectValue,
} from "@/Components/Select/select.types";
import {
  hasNamedSlot,
  mergePartBind,
  resolveFieldAdornmentIconSize,
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
  "maxHeight",
  "searchable",
  "flipOptions",
  "placeholder",
  "optionLabel",
  "optionValue",
  "emptyMessage",
  "disableMaxHeight",
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
  props: SelectProps,
  triggerRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
) {
  const listboxId = useId();

  const {
    slots,
    onOpen,
    onClear,
    onClose,
    onChange,
    onSearch,
    onDeselect,
    defaultValue,
    value: valueProp,
    onSelect: onSelectCallback,
    ...propsForSplit
  } = props;

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLElement | null>(null);

  const [asyncLoading, setAsyncLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState<SelectOption[]>([]);
  const [resolvedSelected, setResolvedSelected] = useState<SelectOption[]>([]);
  const [uncontrolledValue, setUncontrolledValue] =
    useState<SelectProps["value"]>(defaultValue);

  const isControlled = valueProp !== undefined;
  const modelValue = isControlled ? valueProp : uncontrolledValue;

  const { inheritedAttrs, customProps: selectMerged } = splitComponentProps<
    SelectOwnProps,
    typeof selectBridgeKeys
  >({
    bridgeKeys: selectBridgeKeys,
    props: propsForSplit as SelectOwnProps,
  });

  const { entry: bridgeSelect } = useBridgeUIComponent<
    SelectRegistryProps,
    "Select"
  >({
    componentName: "Select",
    props: { classes: selectMerged.classes },
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<SelectClasses>({
    entry: bridgeSelect,
    props: { classes: selectMerged.classes },
  });

  const multiple = Boolean(selectMerged.multiple);

  const optionKeys = useMemo(() => {
    return {
      optionLabel: selectMerged.optionLabel ?? "label",
      optionValue: selectMerged.optionValue ?? "value",
      optionDescription: selectMerged.optionDescription ?? "description",
    };
  }, [
    selectMerged.optionLabel,
    selectMerged.optionValue,
    selectMerged.optionDescription,
  ]);

  const staticOptions = useMemo(() => {
    return normalizeOptions(selectMerged.options, optionKeys);
  }, [optionKeys, selectMerged.options]);

  const resolvedOptions = useMemo(() => {
    const base = asyncOptions.length > 0 ? asyncOptions : staticOptions;

    if (selectMerged.flipOptions) {
      return [...base].reverse();
    }

    return base;
  }, [asyncOptions, staticOptions, selectMerged.flipOptions]);

  const selectedValues = useMemo((): SelectValue[] => {
    const value = modelValue;

    if (multiple) {
      return Array.isArray(value) ? value : [];
    }

    return !isNil(value) && value !== "" ? [value as SelectValue] : [];
  }, [multiple, modelValue]);

  const selectedOptions = useMemo(() => {
    const map = new Map<SelectValue, SelectOption>();

    for (const option of [...resolvedOptions, ...resolvedSelected]) {
      map.set(option.value, option);
    }

    return selectedValues.map((value) => {
      return (
        map.get(value) ?? {
          value,
          label: String(value),
        }
      );
    });
  }, [selectedValues, resolvedOptions, resolvedSelected]);

  const hasValue = selectedValues.length > 0;

  const clearable = selectMerged.clearable !== false;

  const isAsync = Boolean(selectMerged.asyncData);

  const isSearchEnabled =
    isAsync ||
    selectMerged.searchable ||
    staticOptions.length >= (selectMerged.minItemsForSearch ?? 11);

  const isSearchActive = open && isSearchEnabled;

  const isLoading = Boolean(selectMerged.loading) || asyncLoading;

  const visibleOptions = useMemo(() => {
    if (!isSearchActive || !searchQuery.trim()) {
      return resolvedOptions;
    }

    const query = searchQuery.trim().toLowerCase();

    return resolvedOptions.filter((option) => {
      return option.label.toLowerCase().includes(query);
    });
  }, [searchQuery, isSearchActive, resolvedOptions]);

  const navigation = useListboxNavigation(
    visibleOptions,
    highlightedIndex,
    setHighlightedIndex,
    listboxId,
  );

  const triggerReadonly =
    props.readonly || props.disabled ? true : !isSearchActive;

  const displayValue = useMemo(() => {
    if (isSearchActive) {
      return searchQuery;
    }

    if (multiple) {
      return searchQuery;
    }

    return selectedOptions[0]?.label ?? "";
  }, [multiple, searchQuery, isSearchActive, selectedOptions]);

  const setModel = useCallback(
    (next: SelectProps["value"]) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
    },
    [isControlled],
  );

  const emitChange = useCallback(
    (next: SelectProps["value"]) => {
      if (multiple) {
        const value = Array.isArray(next) ? next : [];
        onChange?.(value);

        return;
      }

      const value = (next ?? "") as SelectValue;
      onChange?.(value);
    },
    [multiple, onChange],
  );

  const isSelected = useCallback(
    (value: SelectValue) => {
      return selectedValues.some((item) => valuesEqual(item, value));
    },
    [selectedValues],
  );

  const adjustHeight = useCallback(
    (element: HTMLTextAreaElement | null) => {
      if (!element || !multiple) {
        return;
      }

      adjustAutosizeTextareaHeight(element);
    },
    [multiple],
  );

  const fetchAsyncOptions = useCallback(
    async (query: string) => {
      const asyncData = selectMerged.asyncData;

      if (!asyncData) {
        return;
      }

      setAsyncLoading(true);

      try {
        const results = await asyncData.search(query, {
          selected: selectedValues,
        });

        setAsyncOptions(normalizeAsyncOptions(results, optionKeys));
      } finally {
        setAsyncLoading(false);
      }
    },
    [optionKeys, selectedValues, selectMerged.asyncData],
  );

  const closeMenu = useCallback(() => {
    setOpen((current) => {
      if (!current) {
        return current;
      }

      onClose?.();

      return false;
    });
    setSearchQuery("");
    setHighlightedIndex(-1);
  }, [onClose]);

  const openMenu = useCallback(() => {
    if (props.disabled || props.readonly || open) {
      return;
    }

    setOpen(true);
    setSearchQuery("");
    setHighlightedIndex(highlightCurrentSelection(resolvedOptions, isSelected));
    onOpen?.();
    void fetchAsyncOptions("");
  }, [
    open,
    onOpen,
    isSelected,
    props.disabled,
    props.readonly,
    resolvedOptions,
    fetchAsyncOptions,
  ]);

  const selectOption = useCallback(
    (option: SelectOption) => {
      if (option.disabled) {
        return;
      }

      if (multiple) {
        const current = [...selectedValues];
        const index = current.findIndex((value) =>
          valuesEqual(value, option.value),
        );

        if (index >= 0) {
          current.splice(index, 1);
          onDeselect?.(option);
        } else {
          current.push(option.value);
          onSelectCallback?.(option);
        }

        setModel(current);
        emitChange(current);
        setSearchQuery("");
        setHighlightedIndex(-1);

        requestAnimationFrame(() => {
          adjustHeight(triggerRef.current as HTMLTextAreaElement);
          triggerRef.current?.focus({ preventScroll: true });
        });

        return;
      }

      setModel(option.value);
      emitChange(option.value);
      onSelectCallback?.(option);
      closeMenu();
    },
    [
      multiple,
      setModel,
      closeMenu,
      emitChange,
      onDeselect,
      triggerRef,
      adjustHeight,
      selectedValues,
      onSelectCallback,
    ],
  );

  const clearValue = useCallback(
    (event?: { preventDefault: () => void; stopPropagation: () => void }) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (multiple) {
        setModel([]);
        emitChange([]);
      } else {
        setModel(null);
        emitChange(null);
      }

      onClear?.();
      closeMenu();
    },
    [onClear, multiple, setModel, closeMenu, emitChange],
  );

  const removeChip = useCallback(
    (
      option: SelectOption,
      event: { preventDefault: () => void; stopPropagation: () => void },
    ) => {
      event.preventDefault();
      event.stopPropagation();

      if (!multiple) {
        return;
      }

      const current = selectedValues.filter(
        (value) => !valuesEqual(value, option.value),
      );

      setModel(current);
      emitChange(current);
      onDeselect?.(option);

      requestAnimationFrame(() => {
        adjustHeight(triggerRef.current as HTMLTextAreaElement);
      });
    },
    [
      multiple,
      setModel,
      emitChange,
      onDeselect,
      triggerRef,
      adjustHeight,
      selectedValues,
    ],
  );

  const selectHighlighted = useCallback(() => {
    const option = navigation.getHighlightedOption();

    if (option) {
      selectOption(option);
    }
  }, [navigation, selectOption]);

  const handleTriggerInput = useCallback(
    (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const target = event.currentTarget;

      setSearchQuery(target.value);
      onSearch?.(target.value);

      if (!open) {
        openMenu();
      }

      navigation.resetHighlight();

      void fetchAsyncOptions(target.value);
    },
    [open, onSearch, openMenu, navigation, fetchAsyncOptions],
  );

  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (props.disabled || props.readonly) {
        return;
      }

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();

          if (!open) {
            openMenu();
          } else {
            navigation.moveHighlight(1);
          }

          break;
        case "ArrowUp":
          event.preventDefault();

          if (!open) {
            openMenu();
          } else {
            navigation.moveHighlight(-1);
          }

          break;
        case "Enter":
          event.preventDefault();

          if (!open) {
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
          if (open) {
            event.preventDefault();
            navigation.highlightFirst();
          }

          break;
        case "End":
          if (open) {
            event.preventDefault();
            navigation.highlightLast();
          }

          break;
        case "Backspace":
          if (multiple && !searchQuery && selectedOptions.length > 0) {
            event.preventDefault();
            const last = selectedOptions.at(-1);

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
    },
    [
      open,
      multiple,
      openMenu,
      closeMenu,
      navigation,
      removeChip,
      searchQuery,
      props.disabled,
      props.readonly,
      selectedOptions,
      selectHighlighted,
    ],
  );

  const handleClearPointer = useCallback((event: MouseEvent) => {
    event.preventDefault();
  }, []);

  const handleContainerClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (props.disabled || props.readonly) {
        return;
      }

      const target = event.target as HTMLElement;

      if (target.closest("[data-select-clear]")) {
        return;
      }

      if (
        target.closest(".wrapper-start-slot") ||
        target.closest(".wrapper-end-slot")
      ) {
        return;
      }

      if (!open) {
        openMenu();
        return;
      }

      if (!isSearchActive) {
        closeMenu();
        triggerRef.current?.focus({ preventScroll: true });
      }
    },
    [
      open,
      openMenu,
      closeMenu,
      triggerRef,
      props.disabled,
      props.readonly,
      isSearchActive,
    ],
  );

  const handleContainerRef = useCallback((element: HTMLElement | null) => {
    containerRef.current = element;
  }, []);

  const formFieldSlots = useMemo(() => {
    if (!slots) {
      return undefined;
    }

    const {
      chip: _chip,
      empty: _empty,
      option: _option,
      loading: _loading,
      afterOptions: _afterOptions,
      beforeOptions: _beforeOptions,
      ...rest
    } = slots;

    return rest;
  }, [slots]);

  const formFieldInput = useMemo((): Omit<FormFieldOwnProps, "field"> => {
    const inherited = omit(inheritedAttrs, ["className"]);

    const { customProps: formFieldCustom } = splitComponentProps<
      Omit<FormFieldOwnProps, "field">,
      typeof formFieldBridgeKeys
    >({
      bridgeKeys: formFieldBridgeKeys,
      props: inherited as Omit<FormFieldOwnProps, "field">,
    });

    const endIcon =
      formFieldCustom.endIcon ??
      (hasNamedSlot(formFieldSlots, "end") ? undefined : ChevronsUpDown);

    return {
      ...formFieldCustom,
      endIcon,
      slots: formFieldSlots,
      classes: mergedClasses,
      partsProps: {
        ...formFieldCustom.partsProps,
        container: mergePartBind(
          formFieldCustom.partsProps?.container,
          {},
          {
            ref: handleContainerRef,
            onClick: handleContainerClick,
            className: cn({
              "cursor-pointer":
                !props.disabled && !props.readonly && !isSearchActive,
            }),
          },
        ),
      },
    };
  }, [
    mergedClasses,
    formFieldSlots,
    props.disabled,
    props.readonly,
    inheritedAttrs,
    isSearchActive,
    handleContainerRef,
    handleContainerClick,
  ]);

  const formField = useFormField(
    formFieldInput,
    {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      withErrorIcon: true,
    },
    {
      likeInput: () => multiple,
      control: () => (multiple ? "textarea" : "input"),
    },
  );

  const listboxColor = formField.invalidated
    ? ("error" as const)
    : (formField.merged.color ?? "primary");

  const selectedValueTextClass = get(colorProps, listboxColor)?.value;

  const triggerBind = useMemo(() => {
    const showPointerCursor =
      !props.disabled && !props.readonly && !isSearchActive;

    const showTextCursor =
      !props.disabled && !props.readonly && isSearchActive && isSearchEnabled;

    const showSelectedValueStyle = hasValue && !multiple && !isSearchActive;

    return mergePartBind(
      {
        role: "combobox",
        value: displayValue,
        "aria-expanded": open,
        readOnly: triggerReadonly,
        "aria-controls": listboxId,
        onKeyDown: handleTriggerKeyDown,
        placeholder: selectMerged.placeholder,
        "aria-autocomplete": isSearchEnabled ? "list" : undefined,
        "aria-activedescendant": open
          ? navigation.activeDescendantId
          : undefined,
        ...(multiple
          ? {
              rows: 1,
              onInput: (event: FormEvent<HTMLTextAreaElement>) => {
                handleTriggerInput(event);
                adjustHeight(event.currentTarget);
              },
            }
          : {
              onInput: handleTriggerInput,
            }),
      },
      formField.inputBind,
      cn({
        "cursor-text": showTextCursor,
        "cursor-pointer": showPointerCursor,
        "min-w-0 flex-1": !multiple,
        "resize-none overflow-hidden": multiple,
        [cn(selectedValueTextClass, mergedClasses.value) ?? ""]:
          showSelectedValueStyle,
      }),
    );
  }, [
    open,
    hasValue,
    multiple,
    listboxId,
    adjustHeight,
    displayValue,
    props.disabled,
    props.readonly,
    isSearchActive,
    isSearchEnabled,
    triggerReadonly,
    handleTriggerInput,
    formField.inputBind,
    mergedClasses.value,
    handleTriggerKeyDown,
    selectedValueTextClass,
    selectMerged.placeholder,
    navigation.activeDescendantId,
  ]);

  const clearIconSize = resolveFieldAdornmentIconSize(formField.merged.size);

  const clearBind = useMemo(() => {
    return mergePartBind(
      {},
      {},
      {
        tabIndex: 0,
        role: "button",
        "data-select-clear": true,
        onMouseDown: handleClearPointer,
        className: cn({
          "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors duration-150": true,
          [get(colorProps, listboxColor)?.clear ?? ""]: true,
          [mergedClasses.clear ?? ""]: true,
        }),
      },
    );
  }, [listboxColor, handleClearPointer, mergedClasses.clear]);

  const resolveSelectedOptions = useCallback(async () => {
    const asyncData = selectMerged.asyncData;

    if (!asyncData?.resolveSelected || selectedValues.length === 0) {
      return;
    }

    setResolvedSelected(
      normalizeAsyncOptions(
        await asyncData.resolveSelected(selectedValues),
        optionKeys,
      ),
    );
  }, [optionKeys, selectedValues, selectMerged.asyncData]);

  useEffect(() => {
    adjustHeight(triggerRef.current as HTMLTextAreaElement | null);
  }, [open, multiple, triggerRef, adjustHeight]);

  useEffect(() => {
    void resolveSelectedOptions();
  }, [resolveSelectedOptions]);

  useEffect(() => {
    setAsyncOptions([]);
    void resolveSelectedOptions();
  }, [selectMerged.asyncData, resolveSelectedOptions]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (next) {
        openMenu();
      } else {
        closeMenu();
      }
    },
    [openMenu, closeMenu],
  );

  const emptyMessage = selectMerged.emptyMessage ?? "No options";
  const hideEmptyMessage = selectMerged.hideEmptyMessage === true;

  return {
    open,
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
    listboxColor,
    selectOption,
    containerRef,
    emptyMessage,
    clearIconSize,
    visibleOptions,
    isSearchActive,
    selectedOptions,
    highlightedIndex,
    hideEmptyMessage,
    handleOpenChange,
  };
}
