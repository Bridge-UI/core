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
import type { ListItemCustomProps } from "@/Components/ListItem/listItem.types";
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
  loadingMessage = "Loading...",
  ...ownProps
}: ListboxProps) {
  const {
    checkClass,
    scrollBind,
    contentBind,
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

  function handleSelect(option: ListboxOption) {
    if (option.disabled) {
      return;
    }

    onSelect?.(option);
  }

  return (
    <Menu
      show={show}
      closeOnClickAway
      anchorEl={anchorEl}
      placement={placement}
      onShowChange={onShowChange}
      disableAutoFocus={disableAutoFocus}
      customProps={{ content: contentBind }}
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
              const optionCustomProps = getOptionCustomProps(option, index);

              return (
                <ListItem
                  interactive
                  role="option"
                  selected={false}
                  aria-selected={selected}
                  key={String(option.value)}
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
                    root: { id: getListboxOptionId(listboxId, index) },
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
