// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
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
  commitFreeSoloValue,
  createSelectAsyncSearch,
  filterListboxEntries,
  flattenListboxOptions,
  normalizeListboxEntries,
  normalizeSelectOptions,
  resolveFieldOverlay,
  resolveSelectAsyncDebounce,
  resolveSelectAsyncOptions,
  selectValuesEqual,
  type ListboxEntry,
  type SelectAsyncSearch,
} from "@bridge-ui/core/Domain";
import {
  listboxColorProps as colorProps,
  listboxInvalidatedProps as invalidatedProps,
} from "@bridge-ui/core/Tokens";
import {
  adjustAutosizeTextareaHeight,
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  AutocompleteClasses,
  AutocompleteCustomProps,
  AutocompleteOwnProps,
  AutocompleteProps,
  SelectOption,
  SelectValue,
} from "@/Components/Autocomplete/autocomplete.types";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/hooks/useFormField";
import {
  highlightCurrentSelection,
  useListboxNavigation,
} from "@/Components/Listbox/hooks/useListboxNavigation";
import {
  derived,
  hasNamedSlot,
  mergePartBind,
  resolveFieldAdornmentIconSize,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
  useFieldShowFooter,
} from "@/Utils";
import { useBreakpoint } from "@/Utils/useBreakpoint";

const autocompleteBridgeKeys = [
  "classes",
  "loading",
  "options",
  "overlay",
  "children",
  "freeSolo",
  "multiple",
  "asyncData",
  "clearable",
  "maxHeight",
  "searchable",
  "showFooter",
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
] as const satisfies readonly (keyof AutocompleteOwnProps)[];

type AutocompleteRegistryProps = Pick<AutocompleteOwnProps, "classes">;

export function useAutocomplete(
  props: AutocompleteProps,
  triggerRef: RefObject<null | HTMLInputElement | HTMLTextAreaElement>,
) {
  const listboxId = useId();
  const resolveMessage = useResolveMessage();

  const {
    slots,
    onOpen,
    onClear,
    onClose,
    onApply,
    onChange,
    onSearch,
    onCancel,
    onDeselect,
    defaultValue,
    value: valueProp,
    onSelect: onSelectCallback,
    ...propsForSplit
  } = props;

  const breakpoint = useBreakpoint();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [draftValues, setDraftValues] = useState<SelectValue[]>([]);
  const containerRef = useRef<null | HTMLElement>(null);

  const [asyncLoading, setAsyncLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState<SelectOption[]>([]);
  const asyncSearchRef = useRef<null | SelectAsyncSearch>(null);
  const [resolvedSelected, setResolvedSelected] = useState<SelectOption[]>([]);
  const [uncontrolledValue, setUncontrolledValue] =
    useState<AutocompleteProps["value"]>(defaultValue);

  const isControlled = valueProp !== undefined;
  const modelValue = isControlled ? valueProp : uncontrolledValue;

  const { inheritedAttrs, componentProps: autocompleteMerged } =
    splitComponentProps<AutocompleteOwnProps, typeof autocompleteBridgeKeys>({
      bridgeKeys: autocompleteBridgeKeys,
      props: propsForSplit as AutocompleteOwnProps,
    });

  const { components, entry: bridgeAutocomplete } = useBridgeUIComponent<
    AutocompleteRegistryProps,
    "Autocomplete"
  >({
    componentName: "Autocomplete",
    props: { classes: autocompleteMerged.classes },
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<AutocompleteClasses>({
    entry: bridgeAutocomplete,
    props: { classes: autocompleteMerged.classes },
  });

  const multiple = Boolean(autocompleteMerged.multiple);

  const optionKeys = useMemo(() => {
    return {
      optionLabel: autocompleteMerged.optionLabel ?? "label",
      optionValue: autocompleteMerged.optionValue ?? "value",
      optionDescription: autocompleteMerged.optionDescription ?? "description",
    };
  }, [
    autocompleteMerged.optionLabel,
    autocompleteMerged.optionValue,
    autocompleteMerged.optionDescription,
  ]);

  const staticEntries = useMemo(() => {
    return normalizeListboxEntries(autocompleteMerged.options, optionKeys);
  }, [optionKeys, autocompleteMerged.options]);

  const staticOptions = useMemo(() => {
    return flattenListboxOptions(staticEntries);
  }, [staticEntries]);

  const [registeredOptions, setRegisteredOptions] = useState<SelectOption[]>(
    [],
  );

  const handleRegisteredOptionsChange = useCallback(
    (options: SelectOption[]) => {
      setRegisteredOptions((current) => {
        if (
          current.length === options.length &&
          current.every(
            (option, index) =>
              String(option.value) === String(options[index]?.value),
          )
        ) {
          return current;
        }

        return options;
      });
    },
    [],
  );

  const hasComposedChildren = autocompleteMerged.children != null;

  const resolvedEntries = useMemo((): ListboxEntry[] => {
    if (hasComposedChildren) {
      return [];
    }

    if (asyncOptions.length > 0) {
      const asyncEntries = normalizeListboxEntries(asyncOptions, optionKeys);

      if (autocompleteMerged.flipOptions) {
        return [...asyncEntries].reverse();
      }

      return asyncEntries;
    }

    if (autocompleteMerged.flipOptions) {
      return [...staticEntries].reverse().map((entry) => {
        if (entry.type === "section") {
          return { ...entry, options: [...entry.options].reverse() };
        }

        return entry;
      });
    }

    return staticEntries;
  }, [
    optionKeys,
    asyncOptions,
    staticEntries,
    hasComposedChildren,
    autocompleteMerged.flipOptions,
  ]);

  const resolvedOptions = useMemo(() => {
    if (hasComposedChildren) {
      return registeredOptions;
    }

    return flattenListboxOptions(resolvedEntries);
  }, [resolvedEntries, registeredOptions, hasComposedChildren]);

  const selectedValues = useMemo((): SelectValue[] => {
    const value = modelValue;

    if (multiple) {
      return Array.isArray(value) ? value : [];
    }

    return !isNil(value) && value !== "" ? [value as SelectValue] : [];
  }, [multiple, modelValue]);

  const resolvedOverlay = derived(() => {
    return resolveFieldOverlay(autocompleteMerged.overlay, breakpoint.mobile);
  });

  const showFooter = useFieldShowFooter(
    "Autocomplete",
    autocompleteMerged.showFooter,
    resolvedOverlay,
  );

  const activeValues = derived(() => {
    return showFooter ? draftValues : selectedValues;
  });

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

  const hasValue = derived(() => {
    return selectedValues.length > 0;
  });

  const clearable = derived(() => {
    return autocompleteMerged.clearable !== false;
  });

  const isAsync = derived(() => {
    return Boolean(autocompleteMerged.asyncData);
  });

  const isSearchEnabled = derived(() => {
    return (
      isAsync ||
      (autocompleteMerged.searchable ?? true) ||
      staticOptions.length >= (autocompleteMerged.minItemsForSearch ?? 11)
    );
  });

  const isSearchActive = derived(() => {
    return open && isSearchEnabled;
  });

  const isLoading = derived(() => {
    return Boolean(autocompleteMerged.loading) || asyncLoading;
  });

  const visibleEntries = useMemo(() => {
    if (hasComposedChildren) {
      return [];
    }

    if (!isSearchActive || !searchQuery.trim()) {
      return resolvedEntries;
    }

    const query = searchQuery.trim().toLowerCase();

    return filterListboxEntries(resolvedEntries, (option) => {
      return option.label.toLowerCase().includes(query);
    });
  }, [searchQuery, isSearchActive, resolvedEntries, hasComposedChildren]);

  const visibleOptions = useMemo(() => {
    if (hasComposedChildren) {
      return registeredOptions;
    }

    return flattenListboxOptions(visibleEntries);
  }, [visibleEntries, registeredOptions, hasComposedChildren]);

  const navigation = useListboxNavigation(
    visibleOptions,
    highlightedIndex,
    setHighlightedIndex,
    listboxId,
  );

  const triggerReadonly = derived(() => {
    return props.readonly || props.disabled ? true : !isSearchActive;
  });

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
    (next: AutocompleteProps["value"]) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
    },
    [isControlled],
  );

  const emitChange = useCallback(
    (next: AutocompleteProps["value"]) => {
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
      return activeValues.some((item) => selectValuesEqual(item, value));
    },
    [activeValues],
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
      const asyncData = autocompleteMerged.asyncData;

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
    [optionKeys, selectedValues, autocompleteMerged.asyncData],
  );

  const closeMenu = useCallback(
    (options?: { commitFreeSolo?: boolean }) => {
      asyncSearchRef.current?.cancel();

      if (
        open &&
        options?.commitFreeSolo &&
        autocompleteMerged.freeSolo !== false
      ) {
        const next = commitFreeSoloValue(searchQuery, selectedValues, multiple);

        if (next != null) {
          setModel(next);
          emitChange(next);

          if (multiple) {
            requestAnimationFrame(() => {
              adjustHeight(triggerRef.current as HTMLTextAreaElement);
              triggerRef.current?.focus({ preventScroll: true });
            });
          }
        }
      }

      setOpen((current) => {
        if (!current) {
          return current;
        }

        onClose?.();

        return false;
      });
      setSearchQuery("");
      setHighlightedIndex(-1);
    },
    [
      open,
      multiple,
      onClose,
      setModel,
      emitChange,
      searchQuery,
      triggerRef,
      adjustHeight,
      selectedValues,
      autocompleteMerged.freeSolo,
    ],
  );

  const openMenu = useCallback(() => {
    if (props.disabled || props.readonly || open) {
      return;
    }

    setDraftValues(selectedValues);
    setOpen(true);
    setSearchQuery("");
    setHighlightedIndex(
      highlightCurrentSelection(resolvedOptions, (value) =>
        selectedValues.some((item) => selectValuesEqual(item, value)),
      ),
    );
    onOpen?.();

    if (isAsync && autocompleteMerged.asyncData) {
      asyncSearchRef.current?.searchImmediate("");
    }
  }, [
    open,
    onOpen,
    isAsync,
    props.disabled,
    props.readonly,
    selectedValues,
    resolvedOptions,
    autocompleteMerged.asyncData,
  ]);

  const selectOption = useCallback(
    (option: SelectOption) => {
      if (option.disabled) {
        return;
      }

      if (showFooter) {
        if (multiple) {
          const current = [...draftValues];
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

          setDraftValues(current);
          setSearchQuery("");
          setHighlightedIndex(-1);

          requestAnimationFrame(() => {
            triggerRef.current?.focus({ preventScroll: true });
          });

          return;
        }

        setDraftValues([option.value]);
        onSelectCallback?.(option);
        setSearchQuery("");
        setHighlightedIndex(-1);

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
      showFooter,
      draftValues,
      adjustHeight,
      selectedValues,
      onSelectCallback,
    ],
  );

  const handleApply = useCallback(() => {
    if (multiple) {
      setModel(draftValues);
      emitChange(draftValues);
    } else {
      const next = draftValues[0] ?? null;
      setModel(next);
      emitChange(next);
    }

    closeMenu();

    onApply?.();
  }, [multiple, onApply, closeMenu, emitChange, setModel, draftValues]);

  const handleCancel = useCallback(() => {
    setDraftValues(selectedValues);

    closeMenu();

    onCancel?.();
  }, [onCancel, closeMenu, selectedValues]);

  const commitFreeSolo = useCallback(() => {
    if (autocompleteMerged.freeSolo === false) {
      return false;
    }

    const next = commitFreeSoloValue(searchQuery, selectedValues, multiple);

    if (next == null) {
      return false;
    }

    setModel(next);
    emitChange(next);
    setSearchQuery("");
    setHighlightedIndex(-1);

    if (multiple) {
      requestAnimationFrame(() => {
        adjustHeight(triggerRef.current as HTMLTextAreaElement);
        triggerRef.current?.focus({ preventScroll: true });
      });

      return true;
    }

    closeMenu();

    return true;
  }, [
    multiple,
    setModel,
    closeMenu,
    emitChange,
    searchQuery,
    triggerRef,
    adjustHeight,
    selectedValues,
    autocompleteMerged.freeSolo,
  ]);

  const clearValue = useCallback(
    (event?: { preventDefault: () => void; stopPropagation: () => void }) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (props.disabled || props.readonly) {
        return;
      }

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
    [
      onClear,
      multiple,
      setModel,
      closeMenu,
      emitChange,
      props.disabled,
      props.readonly,
    ],
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

      return true;
    }

    return false;
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
    [open, isAsync, onSearch, openMenu, navigation],
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
          } else if (!selectHighlighted()) {
            commitFreeSolo();
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
          closeMenu({ commitFreeSolo: true });
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
      commitFreeSolo,
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

      if (target.closest("[data-autocomplete-clear]")) {
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
      (hasNamedSlot(formFieldSlots, "end") ? undefined : "chevronUpDown");

    const { listbox: _listbox, ...formFieldOnlyCustom } =
      (formFieldCustom.customProps ?? {}) as AutocompleteCustomProps;

    return {
      ...formFieldCustom,
      endIcon,
      slots: formFieldSlots,
      classes: mergedClasses,
      customProps: {
        ...formFieldOnlyCustom,
        container: mergePartBind(
          formFieldOnlyCustom.container,
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
    inheritedAttrs,
    isSearchActive,
    props.disabled,
    props.readonly,
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
      showErrorIcon: true,
    },
    {
      likeInput: () => multiple,
      componentName: "Autocomplete",
      control: () => (multiple ? "textarea" : "input"),
    },
  );

  const showClearIcon = derived(() => {
    return hasValue && clearable && !props.readonly && !formField.isDisabled;
  });

  const listboxPalette = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      get(components, ["Autocomplete", "tokens", "listbox", "color"]),
    );
    const base = get(classes, formField.merged.color ?? "primary");

    if (!formField.invalidated) {
      return base;
    }

    return mergeBridgeUILayeredClasses(
      invalidatedProps,
      get(components, ["Autocomplete", "tokens", "listbox", "invalidated"]),
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
        placeholder: autocompleteMerged.placeholder,
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
    isSearchActive,
    props.disabled,
    props.readonly,
    isSearchEnabled,
    triggerReadonly,
    handleTriggerInput,
    formField.inputBind,
    mergedClasses.value,
    handleTriggerKeyDown,
    selectedValueTextClass,
    autocompleteMerged.placeholder,
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
        "data-autocomplete-clear": true,
        onMouseDown: handleClearPointer,
        className: cn({
          "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors duration-150": true,
          [listboxPalette?.clear ?? ""]: true,
          [mergedClasses.clear ?? ""]: true,
        }),
      },
    );
  }, [handleClearPointer, mergedClasses.clear, listboxPalette?.clear]);

  const resolveSelectedOptions = useCallback(async () => {
    const asyncData = autocompleteMerged.asyncData;

    if (!asyncData?.resolve || selectedValues.length === 0) {
      return;
    }

    setResolvedSelected(
      normalizeSelectOptions(
        await asyncData.resolve(selectedValues),
        optionKeys,
      ),
    );
  }, [optionKeys, selectedValues, autocompleteMerged.asyncData]);

  useEffect(() => {
    if (!isAsync || !autocompleteMerged.asyncData) {
      asyncSearchRef.current?.cancel();
      asyncSearchRef.current = null;
      return;
    }

    const search = createSelectAsyncSearch(
      (query) => void fetchAsyncOptions(query),
      resolveSelectAsyncDebounce(autocompleteMerged.asyncData),
    );

    asyncSearchRef.current = search;

    return () => search.cancel();
  }, [isAsync, fetchAsyncOptions, autocompleteMerged.asyncData]);

  useEffect(() => {
    adjustHeight(triggerRef.current as null | HTMLTextAreaElement);
  }, [open, multiple, triggerRef, adjustHeight]);

  useEffect(() => {
    void resolveSelectedOptions();
  }, [resolveSelectedOptions]);

  useEffect(() => {
    setAsyncOptions([]);
    void resolveSelectedOptions();
  }, [resolveSelectedOptions, autocompleteMerged.asyncData]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (next) {
        openMenu();
      } else {
        closeMenu({ commitFreeSolo: true });
      }
    },
    [openMenu, closeMenu],
  );

  const emptyMessage =
    autocompleteMerged.emptyMessage ?? resolveMessage("No options");
  const loadingMessage =
    autocompleteMerged.loadingMessage ?? resolveMessage("Loading...");
  const hideEmptyMessage = autocompleteMerged.hideEmptyMessage === true;

  const listboxProps = useMemo(() => {
    return {
      multiple,
      listboxId,
      isSelected,
      showFooter,
      emptyMessage,
      loadingMessage,
      hideEmptyMessage,
      highlightedIndex,
      loading: isLoading,
      onApply: handleApply,
      onCancel: handleCancel,
      disableAutoFocus: true,
      overlay: props.overlay,
      entries: visibleEntries,
      options: visibleOptions,
      maxHeight: props.maxHeight,
      size: formField.merged.size,
      color: formField.merged.color,
      labelledBy: formField.controlId,
      rounded: formField.merged.rounded,
      invalidated: formField.invalidated,
      componentName: "Autocomplete" as const,
      disableMaxHeight: props.disableMaxHeight === true,
      onRegisteredOptionsChange: handleRegisteredOptionsChange,
      ...props.customProps?.listbox,
    };
  }, [
    multiple,
    isLoading,
    listboxId,
    isSelected,
    emptyMessage,
    handleApply,
    handleCancel,
    loadingMessage,
    visibleEntries,
    visibleOptions,
    props.overlay,
    props.maxHeight,
    hideEmptyMessage,
    highlightedIndex,
    formField.controlId,
    formField.invalidated,
    formField.merged.size,
    formField.merged.color,
    props.disableMaxHeight,
    formField.merged.rounded,
    props.customProps?.listbox,
    showFooter,
    handleRegisteredOptionsChange,
  ]);

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
    listboxProps,
    emptyMessage,
    clearIconSize,
    mergedClasses,
    showClearIcon,
    loadingMessage,
    visibleOptions,
    isSearchActive,
    selectedOptions,
    highlightedIndex,
    hideEmptyMessage,
    handleOpenChange,
    children: autocompleteMerged.children,
  };
}
