// ** External Imports
import type { InputHTMLAttributes, Slot, TextareaHTMLAttributes } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldOwnProps,
  FormFieldPartsProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import type { ListboxOption } from "@/Components/Listbox/listbox.types";

export type SelectValue = string | number;

export type SelectModel = SelectValue | SelectValue[];

export type SelectOption = ListboxOption;

export type SelectOptionInput =
  | SelectOption
  | string
  | number
  | Record<string, unknown>;

export type SelectAsyncData =
  | string
  | {
      alwaysFetch?: boolean;
      credentials?: RequestCredentials;
      method?: "GET" | "POST";
      params?: Record<string, unknown>;
      url: string;
    }
  | {
      resolveSelected?: (values: SelectValue[]) => Promise<SelectOptionLike[]>;
      search: (
        query: string,
        ctx: { selected: SelectValue[] },
      ) => Promise<SelectOptionLike[]>;
    };

export type SelectOptionLike = SelectOption | string | Record<string, unknown>;

export interface SelectClasses extends FormFieldClasses {
  /**
   * The classes to apply to selected chips (multiple mode).
   */
  chip?: string;

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

export interface SelectPartsProps extends FormFieldPartsProps {}

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
   * Initial value when uncontrolled.
   */
  defaultValue?: SelectModel;

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
}

export interface SelectSlots extends FormFieldSlots {
  /**
   * Content below the trigger, above the option list.
   */
  afterOptions?: Slot;

  /**
   * Content above the option list.
   */
  beforeOptions?: Slot;

  /**
   * Custom chip content (multiple mode).
   */
  chip?: Slot<{ option: SelectOption }>;

  /**
   * Custom empty-state content.
   */
  empty?: Slot;

  /**
   * Custom loading content.
   */
  loading?: Slot;

  /**
   * Custom option item content.
   */
  option?: Slot<{ option: SelectOption; selected: boolean }>;
}

export type SelectSingleProps = MergeHtmlProps<
  SelectOwnProps,
  InputHTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component.
   */
  modelValue?: SelectValue | null;

  /**
   * Whether multiple values can be selected.
   *
   * @default false
   */
  multiple: false;
};

export type SelectMultipleProps = MergeHtmlProps<
  SelectOwnProps,
  TextareaHTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component.
   */
  modelValue?: SelectValue[] | null;

  /**
   * Whether multiple values can be selected.
   *
   * @default true
   */
  multiple: true;
};

export type SelectProps = SelectSingleProps | SelectMultipleProps;

export interface SelectEmits {
  /**
   * Emitted when the selection changes.
   */
  change: [value: SelectModel];

  /**
   * Emitted when the value is cleared.
   */
  clear: [];

  /**
   * Emitted when the menu closes.
   */
  close: [];

  /**
   * Emitted when an option is deselected (multiple mode).
   */
  deselect: [option: SelectOption];

  /**
   * Emitted when the menu opens.
   */
  open: [];

  /**
   * Emitted when the search query changes.
   */
  search: [query: string];

  /**
   * Emitted when an option is selected.
   */
  select: [option: SelectOption];

  /**
   * Emitted when `v-model` should update.
   */
  "update:modelValue": [value: SelectModel];
}

export interface SelectOptionProps {
  /**
   * Secondary line below the label.
   */
  description?: string;

  /**
   * Whether the option is disabled.
   */
  disabled?: boolean;

  /**
   * The label of the option.
   */
  label: string;

  /**
   * The value of the option.
   */
  value: SelectValue;
}
