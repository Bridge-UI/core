// ** External Imports
import { Check } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";

// ** Core Imports
import {
  cn,
  entriesFromListboxOptions,
  flattenListboxOptions,
  mapListboxEntriesToRows,
  type ListboxOption,
  type ListboxValue,
} from "@bridge-ui/core";

// ** Local Imports
import { List } from "@/Components/List";
import { useListbox } from "@/Components/Listbox/hooks/useListbox";
import { getListboxOptionId } from "@/Components/Listbox/hooks/useListboxNavigation";
import type { ListboxProps } from "@/Components/Listbox/listbox.types";
import {
  ListboxContext,
  type ListboxContextValue,
} from "@/Components/Listbox/ListboxContext";
import { ListItem } from "@/Components/ListItem";
import type { ListItemCustomProps } from "@/Components/ListItem/listItem.types";
import { ListSection } from "@/Components/ListSection";
import { Menu } from "@/Components/Menu";

const listboxLibDefaults = {
  size: "md",
  color: "primary",
} as const;

function keepFocusOnCombobox(event: MouseEvent) {
  event.preventDefault();
}

function Listbox({
  slots,
  options,
  entries,
  children,
  onSelect,
  anchorEl,
  listboxId,
  labelledBy,
  show = false,
  onShowChange,
  loading = false,
  multiple = false,
  showCheckmark = true,
  highlightedIndex = -1,
  hideEmptyMessage = false,
  disableAutoFocus = false,
  onRegisteredOptionsChange,
  placement = "bottom-start",
  isSelected: isSelectedProp,
  emptyMessage = "No options",
  loadingMessage = "Loading...",
  ...ownProps
}: ListboxProps) {
  const resolvedOptions = useMemo(() => {
    return options ?? [];
  }, [options]);

  const {
    merged,
    checkClass,
    scrollBind,
    messageBind,
    loadingBind,
    sizeClasses,
    mergedClasses,
    loadingTrackBind,
    optionSelectedClass,
    optionHighlightedClass,
  } = useListbox(
    {
      ...ownProps,
      loading,
      multiple,
      anchorEl,
      listboxId,
      placement,
      labelledBy,
      emptyMessage,
      showCheckmark,
      highlightedIndex,
      hideEmptyMessage,
      disableAutoFocus,
      options: resolvedOptions,
      isSelected: isSelectedProp,
    },
    listboxLibDefaults,
  );

  const resolvedEntries = useMemo(() => {
    if (entries) {
      return entries;
    }

    return entriesFromListboxOptions(resolvedOptions);
  }, [entries, resolvedOptions]);

  const flatOptions = useMemo(() => {
    return flattenListboxOptions(resolvedEntries);
  }, [resolvedEntries]);

  const hasComposedChildren = children != null;

  const showEmptyState =
    !loading &&
    !hasComposedChildren &&
    flatOptions.length === 0 &&
    hideEmptyMessage !== true;

  const resolvedCheckClass = cn(checkClass, mergedClasses.check);

  const registeredOptionsRef = useRef<ListboxOption[]>([]);
  const [registeredOptions, setRegisteredOptions] = useState<ListboxOption[]>(
    [],
  );
  const flatOptionsRef = useRef(flatOptions);
  const hasComposedChildrenRef = useRef(hasComposedChildren);

  useEffect(() => {
    flatOptionsRef.current = flatOptions;
  }, [flatOptions]);

  useEffect(() => {
    hasComposedChildrenRef.current = hasComposedChildren;
  }, [hasComposedChildren]);

  const resolveSelected = useCallback(
    (value: ListboxValue) => {
      return isSelectedProp?.(value) ?? false;
    },
    [isSelectedProp],
  );

  const mappedRows = useMemo(() => {
    return mapListboxEntriesToRows(resolvedEntries, resolveSelected);
  }, [resolveSelected, resolvedEntries]);

  const handleSelect = useCallback(
    (option: ListboxOption) => {
      if (option.disabled) {
        return;
      }

      onSelect?.(option);
    },
    [onSelect],
  );

  const registerOption = useCallback((option: ListboxOption) => {
    const alreadyRegistered = registeredOptionsRef.current.some(
      (entry) => String(entry.value) === String(option.value),
    );

    if (!alreadyRegistered) {
      registeredOptionsRef.current = [...registeredOptionsRef.current, option];
      setRegisteredOptions(registeredOptionsRef.current);
    }

    return () => {
      registeredOptionsRef.current = registeredOptionsRef.current.filter(
        (entry) => String(entry.value) !== String(option.value),
      );
      setRegisteredOptions([...registeredOptionsRef.current]);
    };
  }, []);

  const getOptionIndex = useCallback((value: ListboxValue) => {
    const source = hasComposedChildrenRef.current
      ? registeredOptionsRef.current
      : flatOptionsRef.current;

    return source.findIndex((option) => String(option.value) === String(value));
  }, []);

  useEffect(() => {
    if (!hasComposedChildren) {
      return;
    }

    onRegisteredOptionsChange?.(registeredOptions);
  }, [registeredOptions, hasComposedChildren, onRegisteredOptionsChange]);

  const listboxContext = useMemo((): ListboxContextValue => {
    return {
      listboxId,
      sizeClasses,
      showCheckmark,
      getOptionIndex,
      registerOption,
      highlightedIndex,
      optionSelectedClass,
      onSelect: handleSelect,
      optionHighlightedClass,
      isSelected: resolveSelected,
      checkClass: resolvedCheckClass,
      mergedClasses: {
        optionSelected: mergedClasses.optionSelected,
        optionHighlighted: mergedClasses.optionHighlighted,
      },
    };
  }, [
    listboxId,
    sizeClasses,
    handleSelect,
    showCheckmark,
    getOptionIndex,
    registerOption,
    resolveSelected,
    highlightedIndex,
    resolvedCheckClass,
    optionSelectedClass,
    optionHighlightedClass,
    mergedClasses.optionSelected,
    mergedClasses.optionHighlighted,
  ]);

  function isOptionHighlighted(index: number) {
    return highlightedIndex === index;
  }

  function getOptionCustomProps(
    option: ListboxOption,
    index: number,
  ): ListItemCustomProps {
    const interactive: NonNullable<ListItemCustomProps["interactive"]> = {
      tabIndex: -1,
      onMouseDown: keepFocusOnCombobox,
      className: cn(sizeClasses?.option),
    };

    if (resolveSelected(option.value)) {
      interactive.className = cn(
        interactive.className,
        optionSelectedClass,
        mergedClasses.optionSelected,
      );
    } else if (isOptionHighlighted(index)) {
      interactive.className = cn(
        interactive.className,
        optionHighlightedClass,
        mergedClasses.optionHighlighted,
      );
    }

    return {
      interactive,
      primary: { className: sizeClasses?.primary },
      secondary: { className: sizeClasses?.secondary },
    };
  }

  return (
    <Menu
      show={show}
      closeOnClickAway
      anchorEl={anchorEl}
      placement={placement}
      onShowChange={onShowChange}
      disableAutoFocus={disableAutoFocus}
      customProps={{ content: merged.customProps?.content }}
    >
      {slots?.beforeOptions}

      {loading ? (
        <>
          <div {...loadingTrackBind}>
            <div {...loadingBind} />
          </div>

          <div {...messageBind}>{slots?.loading ?? loadingMessage}</div>
        </>
      ) : (
        <div {...scrollBind}>
          <ListboxContext.Provider value={listboxContext}>
            <List
              dense
              role="listbox"
              id={listboxId}
              className="p-0"
              aria-labelledby={labelledBy}
              aria-multiselectable={multiple || undefined}
            >
              {hasComposedChildren
                ? children
                : mappedRows.map((row) => {
                    if (row.kind === "section") {
                      return (
                        <ListSection
                          key={row.key}
                          title={row.title}
                          sticky={row.sticky}
                        />
                      );
                    }

                    const { index, option, selected } = row;
                    const optionCustomProps = getOptionCustomProps(
                      option,
                      index,
                    );

                    return (
                      <ListItem
                        interactive
                        role="option"
                        key={row.key}
                        selected={false}
                        aria-selected={selected}
                        disabled={option.disabled}
                        secondary={option.description}
                        primary={slots?.option ? undefined : option.label}
                        slots={{
                          end:
                            showCheckmark && selected ? (
                              <Check className={resolvedCheckClass} />
                            ) : undefined,
                        }}
                        customProps={{
                          ...optionCustomProps,
                          root: {
                            id: getListboxOptionId(listboxId, index),
                          },
                          interactive: {
                            ...optionCustomProps.interactive,
                            onClick: () => handleSelect(option),
                          },
                        }}
                      >
                        {slots?.option?.({ option, selected })}
                      </ListItem>
                    );
                  })}
            </List>
          </ListboxContext.Provider>
        </div>
      )}

      {showEmptyState && !slots?.empty ? (
        <div {...messageBind}>{emptyMessage}</div>
      ) : null}

      {showEmptyState && slots?.empty ? slots.empty : null}

      {slots?.afterOptions}
    </Menu>
  );
}

export default Listbox;
