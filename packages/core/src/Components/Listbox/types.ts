export type ListboxValue = string | number;

export interface ListboxOption {
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
   * Original data when mapped from arbitrary objects.
   */
  raw?: unknown;

  /**
   * The value of the option.
   */
  value: ListboxValue;
}
