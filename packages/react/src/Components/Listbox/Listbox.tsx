// ** External Imports
import { isNil } from "es-toolkit/compat";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
import type { ListboxProps } from "@/Components/Listbox/listbox.types";
import {
  ListboxContext,
  type ListboxContextValue,
} from "@/Components/Listbox/ListboxContext";
import { ListItem } from "@/Components/ListItem";
import { ListSection } from "@/Components/ListSection";
import { Menu } from "@/Components/Menu";
import { Progress } from "@/Components/Progress";
import { mergeNestedComponentProps } from "@/Utils";

const listboxLibDefaults = {
  size: "md",
  color: "primary",
} as const;

function Listbox({
  slots,
  options,
  entries,
  rounded,
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
    sizeClasses,
    mergedClasses,
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

  const menuProps = merged.customProps?.menu;
  const listProps = merged.customProps?.list;
  const listItemProps = merged.customProps?.listItem;
  const progressProps = merged.customProps?.progress;
  const listSectionProps = merged.customProps?.listSection;

  return (
    <Menu
      show={show}
      closeOnClickAway
      anchorEl={anchorEl}
      placement={placement}
      onShowChange={onShowChange}
      disableAutoFocus={disableAutoFocus}
      {...(!isNil(rounded) ? { rounded } : {})}
      {...menuProps}
    >
      {slots?.beforeOptions}

      {loading ? (
        <>
          <Progress
            size="xs"
            aria-hidden
            color={merged.color}
            {...mergeNestedComponentProps(progressProps, {
              className: "shrink-0",
              classes: { bar: mergedClasses.loading },
            })}
          />

          <div {...messageBind}>{slots?.loading ?? loadingMessage}</div>
        </>
      ) : (
        <div {...scrollBind}>
          <ListboxContext.Provider value={listboxContext}>
            <List
              dense
              role="listbox"
              id={listboxId}
              aria-labelledby={labelledBy}
              aria-multiselectable={multiple || undefined}
              {...mergeNestedComponentProps(listProps, {
                className: "p-0",
              })}
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
                          {...listSectionProps}
                        />
                      );
                    }

                    const { option, selected } = row;

                    return (
                      <ListItem
                        interactive
                        key={row.key}
                        value={option.value}
                        disabled={option.disabled}
                        secondary={option.description}
                        primary={slots?.option ? undefined : option.label}
                        {...listItemProps}
                        customProps={listItemProps?.customProps}
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
