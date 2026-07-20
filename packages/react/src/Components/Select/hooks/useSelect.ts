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
  createSelectAsyncSearch,
  mergeBridgeUILayeredClasses,
  normalizeSelectOptions,
  resolveSelectAsyncDebounce,
  resolveSelectAsyncOptions,
  selectValuesEqual,
  splitComponentProps,
  type SelectAsyncSearch,
} from "@bridge-ui/core";
import {
  colorProps,
  invalidatedProps,
} from "@bridge-ui/core/Components/Listbox";

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
  "optionLabel",
  "optionValue",
  "placeholder",
  "emptyMessage",
  "loadingMessage",
  "disableMaxHeight",
  "hideEmptyMessage",
  "minItemsForSearch",
  "optionDescription",
] as const satisfies readonly (keyof SelectOwnProps)[];

type SelectRegistryProps = Pick<SelectOwnProps, "classes">;

export function useSelect(
  props: SelectProps,
  triggerRef: RefObject<null | HTMLInputElement | HTMLTextAreaElement>,
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
  const containerRef = useRef<null | HTMLElement>(null);

  const [asyncLoading, setAsyncLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState<SelectOption[]>([]);
  const asyncSearchRef = useRef<null | SelectAsyncSearch>(null);
  const [resolvedSelected, setResolvedSelected] = useState<SelectOption[]>([]);
  const [uncontrolledValue, setUncontrolledValue] =
    useState<SelectProps["value"]>(defaultValue);

  const isControlled = valueProp !== undefined;
  const modelValue = isControlled ? valueProp : uncontrolledValue;

  const { inheritedAttrs, componentProps: selectMerged } = splitComponentProps<
    SelectOwnProps,
    typeof selectBridgeKeys
  >({
    bridgeKeys: selectBridgeKeys,
    props: propsForSplit as SelectOwnProps,
  });

  const { components, entry: bridgeSelect } = useBridgeUIComponent<
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
    return normalizeSelectOptions(selectMerged.options, optionKeys);
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
      return selectedValues.some((item) => selectValuesEqual(item, value));
    },
    [selectedValues],
  );

  const adjustHeight = useCallback(
    (element: null | HTMLTextAreaElement) => {
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
        const { options, resolvedSelected: resolved } =
          await resolveSelectAsyncOptions(
            asyncData,
            query,
            selectedValues,
            (items) => normalizeSelectOptions(items, optionKeys),
          );

        if (resolved.length > 0) {
          setResolvedSelected(resolved);
        }

        setAsyncOptions(options);
      } finally {
        setAsyncLoading(false);
      }
    },
    [optionKeys, selectedValues, selectMerged.asyncData],
  );

  const closeMenu = useCallback(() => {
    asyncSearchRef.current?.cancel();

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

    if (isAsync && selectMerged.asyncData) {
      asyncSearchRef.current?.searchImmediate("");
    }
  }, [
    open,
    onOpen,
    isAsync,
    isSelected,
    props.disabled,
    props.readonly,
    resolvedOptions,
    selectMerged.asyncData,
  ]);

  const selectOption = useCallback(
    (option: SelectOption) => {
      if (option.disabled) {
        return;
      }

      if (multiple) {
        const current = [...selectedValues];
        const index = current.findIndex((value) =>
          selectValuesEqual(value, option.value),
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
        (value) => !selectValuesEqual(value, option.value),
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

      if (isAsync) {
        asyncSearchRef.current?.searchDebounced(target.value);
      }
    },
    [open, onSearch, openMenu, navigation, isAsync],
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

  const handleContainerRef = useCallback((element: null | HTMLElement) => {
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

    const { componentProps: formFieldCustom } = splitComponentProps<
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
      customProps: {
        ...formFieldCustom.customProps,
        container: mergePartBind(
          formFieldCustom.customProps?.container,
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

  const listboxPalette = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      get(components, ["Listbox", "customProps", "color"]),
    );
    const base = get(classes, formField.merged.color ?? "primary");

    if (!formField.invalidated) {
      return base;
    }

    return mergeBridgeUILayeredClasses(
      invalidatedProps,
      get(components, ["Listbox", "customProps", "invalidated"]),
    );
  }, [components, formField.invalidated, formField.merged.color]);

  const selectedValueTextClass = listboxPalette?.value;

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
          [listboxPalette?.clear ?? ""]: true,
          [mergedClasses.clear ?? ""]: true,
        }),
      },
    );
  }, [handleClearPointer, listboxPalette?.clear, mergedClasses.clear]);

  const resolveSelectedOptions = useCallback(async () => {
    const asyncData = selectMerged.asyncData;

    if (!asyncData?.resolve || selectedValues.length === 0) {
      return;
    }

    setResolvedSelected(
      normalizeSelectOptions(
        await asyncData.resolve(selectedValues),
        optionKeys,
      ),
    );
  }, [optionKeys, selectedValues, selectMerged.asyncData]);

  useEffect(() => {
    if (!isAsync || !selectMerged.asyncData) {
      asyncSearchRef.current?.cancel();
      asyncSearchRef.current = null;
      return;
    }

    const search = createSelectAsyncSearch(
      (query) => void fetchAsyncOptions(query),
      resolveSelectAsyncDebounce(selectMerged.asyncData),
    );

    asyncSearchRef.current = search;

    return () => search.cancel();
  }, [isAsync, selectMerged.asyncData, fetchAsyncOptions]);

  useEffect(() => {
    adjustHeight(triggerRef.current as null | HTMLTextAreaElement);
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
  const loadingMessage = selectMerged.loadingMessage ?? "Loading...";
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
    selectOption,
    containerRef,
    emptyMessage,
    clearIconSize,
    loadingMessage,
    visibleOptions,
    isSearchActive,
    selectedOptions,
    highlightedIndex,
    hideEmptyMessage,
    handleOpenChange,
  };
}
