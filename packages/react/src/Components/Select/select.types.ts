// ** External Imports
import type { InputHTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  MergeHtmlProps,
  SelectAsyncData,
  SelectModel,
  SelectOption,
  SelectOptionInput,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import type { ListboxOwnProps } from "@/Components/Listbox/listbox.types";

export type {
  SelectAsyncData,
  SelectModel,
  SelectOption,
  SelectOptionInput,
  SelectOptionLike,
  SelectValue,
} from "@bridge-ui/core";

export interface SelectCallbacks {
  /**
   * Callback when the selection changes.
   */
  onChange?: (value: SelectModel) => void;

  /**
   * Callback when the value is cleared.
   */
  onClear?: () => void;

  /**
   * Callback when the menu closes.
   */
  onClose?: () => void;

  /**
   * Callback when an option is deselected (multiple mode).
   */
  onDeselect?: (option: SelectOption) => void;

  /**
   * Callback when the menu opens.
   */
  onOpen?: () => void;

  /**
   * Callback when the search query changes.
   */
  onSearch?: (query: string) => void;

  /**
   * Callback when an option is selected.
   */
  onSelect?: (option: SelectOption) => void;
}

export interface SelectClasses extends FormFieldClasses {
  /**
   * The classes to apply to selected chips (multiple mode).
   */
  chip?: string;

  /**
   * The classes to apply to clear icons (rest + hover).
   */
  clear?: string;

  /**
   * The classes to apply to the dropdown content.
   */
  content?: string;

  /**
   * The classes to apply to the option item.
   */
  item?: string;

  /**
   * The classes to apply to the selected value text in the trigger (single mode).
   */
  value?: string;
}

export interface SelectCustomProps extends FormFieldCustomProps {
  /**
   * Props forwarded to the internal `Listbox`.
   * Open state, options, and selection handlers stay owned by `Select`.
   *
   * @default undefined
   */
  listbox?: Partial<
    Omit<
      ListboxOwnProps,
      "options" | "anchorEl" | "listboxId" | "isSelected" | "highlightedIndex"
    >
  >;
}

export interface SelectOwnProps extends Omit<FormFieldOwnProps, "field"> {
  /**
   * Remote data source. Implies `searchable`.
   */
  asyncData?: SelectAsyncData;

  /**
   * Whether the value can be cleared.
   *
   * @default true
   */
  clearable?: boolean;

  /**
   * Extra props for FormField parts and the internal `Listbox`.
   *
   * @default undefined
   */
  customProps?: SelectCustomProps;

  /**
   * Initial value when uncontrolled.
   */
  defaultValue?: null | SelectModel;

  /**
   * When true, the dropdown options list is not height-limited.
   * Forwarded to the internal `Listbox`.
   *
   * @default false
   */
  disableMaxHeight?: boolean;

  /**
   * Message when the filtered list is empty.
   *
   * @default "No options"
   */
  emptyMessage?: string;

  /**
   * Inverts the visual order of options.
   *
   * @default false
   */
  flipOptions?: boolean;

  /**
   * Hides the empty-state message.
   *
   * @default false
   */
  hideEmptyMessage?: boolean;

  /**
   * External or async loading state.
   */
  loading?: boolean;

  /**
   * Message shown in the dropdown while loading.
   *
   * @default "Loading..."
   */
  loadingMessage?: string;

  /**
   * Tailwind max-height class for the dropdown options area.
   * Forwarded to the internal `Listbox`.
   *
   * @default "max-h-60"
   */
  maxHeight?: string;

  /**
   * Minimum option count before search UI is enabled.
   *
   * @default 11
   */
  minItemsForSearch?: number;

  /**
   * Whether multiple values can be selected.
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Key used to read the description from option objects.
   *
   * @default "description"
   */
  optionDescription?: string;

  /**
   * Key used to read the label from option objects.
   *
   * @default "label"
   */
  optionLabel?: string;

  /**
   * The list of options to display.
   */
  options?: SelectOptionInput[];

  /**
   * Key used to read the value from option objects.
   *
   * @default "value"
   */
  optionValue?: string;

  /**
   * Placeholder shown when no value is selected.
   */
  placeholder?: string;

  /**
   * Whether options can be filtered via the trigger input.
   *
   * @default false
   */
  searchable?: boolean;

  /**
   * The selected value (controlled).
   */
  value?: null | SelectModel;
}

export interface SelectSlots extends FormFieldSlots {
  /**
   * Content below the trigger, above the option list.
   */
  afterOptions?: ReactNode;

  /**
   * Content above the option list.
   */
  beforeOptions?: ReactNode;

  /**
   * Custom chip content (multiple mode).
   */
  chip?: (ctx: { option: SelectOption }) => ReactNode;

  /**
   * Custom empty-state content.
   */
  empty?: ReactNode;

  /**
   * Custom loading content.
   */
  loading?: ReactNode;

  /**
   * Custom option item content.
   */
  option?: (ctx: { option: SelectOption; selected: boolean }) => ReactNode;
}

export type SelectProps = MergeHtmlProps<
  SelectOwnProps & SelectCallbacks & { slots?: SelectSlots },
  InputHTMLAttributes<HTMLInputElement>
>;
