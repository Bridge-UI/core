// ** External Imports
import { Check } from "lucide-react";
import type { MouseEvent } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { List } from "@/Components/List";
import { useListbox } from "@/Components/Listbox/hooks/useListbox";
import { getListboxOptionId } from "@/Components/Listbox/hooks/useListboxNavigation";
import type {
  ListboxOption,
  ListboxProps,
  ListboxValue,
} from "@/Components/Listbox/listbox.types";
import { ListItem } from "@/Components/ListItem";
import type { ListItemPartsProps } from "@/Components/ListItem/listItem.types";
import { Menu } from "@/Components/Menu";

const listboxLibDefaults = {
  color: "primary",
} as const;

function keepFocusOnCombobox(event: MouseEvent) {
  event.preventDefault();
}

function Listbox({
  slots,
  options,
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
  placement = "bottom-start",
  isSelected: isSelectedProp,
  emptyMessage = "No options",
  ...ownProps
}: ListboxProps) {
  const {
    merged,
    checkClass,
    mergedClasses,
    optionSelectedClass,
    optionHighlightedClass,
  } = useListbox(
    {
      ...ownProps,
      options,
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
      isSelected: isSelectedProp,
    },
    listboxLibDefaults,
  );

  const showEmptyState =
    !loading && options.length === 0 && hideEmptyMessage !== true;

  const resolvedCheckClass = cn(checkClass, mergedClasses.check);

  function resolveSelected(value: ListboxValue) {
    return isSelectedProp?.(value) ?? false;
  }

  function isOptionHighlighted(index: number) {
    return highlightedIndex === index;
  }

  function getOptionPartsProps(
    option: ListboxOption,
    index: number,
  ): ListItemPartsProps {
    const interactive: NonNullable<ListItemPartsProps["interactive"]> = {
      tabIndex: -1,
      onMouseDown: keepFocusOnCombobox,
    };

    if (resolveSelected(option.value)) {
      interactive.className = cn(
        optionSelectedClass,
        mergedClasses.optionSelected,
      );
    } else if (isOptionHighlighted(index)) {
      interactive.className = cn(
        optionHighlightedClass,
        mergedClasses.optionHighlighted,
      );
    }

    return { interactive };
  }

  function handleSelect(option: ListboxOption) {
    if (option.disabled) {
      return;
    }

    onSelect?.(option);
  }

  return (
    <Menu
      show={show}
      anchorEl={anchorEl}
      placement={placement}
      onShowChange={onShowChange}
      closeOnClickAway
      disableAutoFocus={disableAutoFocus}
      partsProps={{ content: merged.partsProps?.content }}
    >
      {slots?.beforeOptions}

      {loading ? (
        <div className="px-4 py-3 text-sm text-gray-500">
          {slots?.loading ?? <span>Loading...</span>}
        </div>
      ) : (
        <List
          dense
          role="listbox"
          padding="none"
          id={listboxId}
          aria-labelledby={labelledBy}
          aria-multiselectable={multiple || undefined}
        >
          {options.map((option, index) => {
            const selected = resolveSelected(option.value);
            const optionPartsProps = getOptionPartsProps(option, index);

            return (
              <ListItem
                interactive
                role="option"
                selected={false}
                key={String(option.value)}
                primary={slots?.option ? undefined : option.label}
                disabled={option.disabled}
                secondary={option.description}
                aria-selected={selected}
                partsProps={{
                  ...optionPartsProps,
                  root: { id: getListboxOptionId(listboxId, index) },
                  interactive: {
                    ...optionPartsProps.interactive,
                    onClick: () => handleSelect(option),
                  },
                }}
                slots={{
                  end:
                    showCheckmark && selected ? (
                      <Check className={cn("size-4", resolvedCheckClass)} />
                    ) : undefined,
                }}
              >
                {slots?.option?.({ option, selected })}
              </ListItem>
            );
          })}
        </List>
      )}

      {showEmptyState && !slots?.empty ? (
        <div className="px-4 py-3 text-sm text-gray-500">{emptyMessage}</div>
      ) : null}

      {showEmptyState && slots?.empty ? slots.empty : null}

      {slots?.afterOptions}
    </Menu>
  );
}

export default Listbox;
