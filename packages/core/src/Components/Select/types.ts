// ** Core Imports
import type { ListboxOption } from "@core/Components/Listbox/types";

export type SelectValue = number | string;

export type SelectModel = SelectValue | SelectValue[];

export type SelectOption = ListboxOption;

export type SelectOptionInput =
  | number
  | string
  | SelectOption
  | Record<string, unknown>;

export type SelectOptionLike = string | SelectOption | Record<string, unknown>;

export interface SelectAsyncData {
  /**
   * Resolves labels for the current selection (e.g. after reload or when values
   * are set programmatically). Use with remote search for Laravel/API backends.
   */
  resolveSelected?: (values: SelectValue[]) => Promise<SelectOptionLike[]>;

  /**
   * Fetches options for the current search query and selection context.
   */
  search: (
    query: string,
    ctx: { selected: SelectValue[] },
  ) => Promise<SelectOptionLike[]>;
}
