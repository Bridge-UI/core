// ** External Imports
import type { InputHTMLAttributes, Slot, TextareaHTMLAttributes } from "vue";

// ** Core Imports
import type {
  FieldOverlayMode,
  ListboxOptionsInput,
  MergeHtmlProps,
  SelectAsyncData,
  SelectModel,
  SelectOption,
  SelectValue,
} from "@bridge-ui/core";

// ** Local Imports
import type { ChipOwnProps } from "@/Components/Chip/chip.types";
import type {
  FormFieldClasses,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import type { IconProps } from "@/Components/Icon";
import type { ListboxOwnProps } from "@/Components/Listbox/listbox.types";

export type {
  ListboxOptionGroup,
  ListboxOptionsInput,
  SelectAsyncData,
  SelectModel,
  SelectOption,
  SelectOptionInput,
  SelectOptionLike,
  SelectValue,
} from "@bridge-ui/core";

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
   * Props forwarded to each selected-value `Chip` (multiple mode).
   * Dismiss behavior, size, and label stay owned by `Select`.
   *
   * @default undefined
   */
  chip?: Partial<
    Omit<
      ChipOwnProps,
      "size" | "label" | "disabled" | "clearLabel" | "dismissible"
    >
  >;

  /**
   * Props forwarded to the clear `Icon` (`icon` is set by `Select`).
   *
   * @default undefined
   */
  clearIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the internal `Listbox`.
   * Merged last so they override Select defaults.
   *
   * @default undefined
   */
  listbox?: Partial<ListboxOwnProps>;
}

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
   * Extra props for FormField parts, selected chips, clear icon, and the
   * internal `Listbox`.
   *
   * @default undefined
   */
  customProps?: SelectCustomProps;

  /**
   * Initial value for uncontrolled usage (when `v-model` / `modelValue` is
   * not bound).
   *
   * @default undefined
   */
  defaultValue?: SelectModel;

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
   * The list of options to display. May include section groups
   * (`{ title, options, sticky? }`).
   */
  options?: ListboxOptionsInput;

  /**
   * Key used to read the value from option objects.
   *
   * @default "value"
   */
  optionValue?: string;

  /**
   * Which overlay shell opens the options panel. `auto` uses `menu` on desktop
   * and `drawer` (bottom) on mobile. Forwarded to the internal `Listbox`.
   *
   * @default "menu"
   */
  overlay?: FieldOverlayMode;

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
  afterOptions?: Slot<undefined>;

  /**
   * Content above the option list.
   */
  beforeOptions?: Slot<undefined>;

  /**
   * Custom chip content (multiple mode).
   */
  chip?: Slot<{ option: SelectOption }>;

  /**
   * Composed dropdown content (`ListSection` / `ListItem` with `value`).
   * When set (and not using declarative `SelectOption` children), replaces
   * mapped `options` inside the listbox.
   */
  default?: Slot<undefined>;

  /**
   * Custom empty-state content.
   */
  empty?: Slot<undefined>;

  /**
   * Custom loading content.
   */
  loading?: Slot<undefined>;

  /**
   * Custom option item content when rendering from the `options` prop.
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
  modelValue?: null | SelectValue;

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
  modelValue?: null | SelectValue[];

  /**
   * Whether multiple values can be selected.
   *
   * @default true
   */
  multiple: true;
};

export type SelectProps = SelectSingleProps | SelectMultipleProps;
