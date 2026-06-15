// ** External Imports
import { debounce, get, isNil } from "es-toolkit/compat";

/**
 * Default debounce delay (ms) for async select search while typing.
 */
export const DEFAULT_SELECT_ASYNC_DEBOUNCE = 500;

/**
 * Default page size for async select option lists.
 */
export const DEFAULT_SELECT_ASYNC_LIMIT = 20;

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

/**
 * The value of the listbox option.
 */
export type ListboxValue = string | number;

export interface SelectAsyncData {
  /**
   * Delay before calling `search` after the user stops typing (ms).
   * Set to `0` to fetch on every keystroke.
   *
   * @default 500
   */
  debounce?: number;

  /**
   * Max number of options shown in the dropdown (selected values always
   * included; search results fill remaining slots).
   *
   * @default 20
   */
  limit?: number;

  /**
   * Resolves labels for the current selection (e.g. after reload or when values
   * are set programmatically). Use with remote search for Laravel/API backends.
   */
  resolve?: (values: SelectValue[]) => Promise<SelectOptionLike[]>;

  /**
   * Fetches options for the current search query and selection context.
   */
  search: (
    query: string,
    ctx: { selected: SelectValue[] },
  ) => Promise<SelectOptionLike[]>;
}

/**
 * Debounced search helpers for async select data.
 */
export type SelectAsyncSearch = {
  cancel: () => void;
  searchDebounced: (query: string) => void;
  searchImmediate: (query: string) => void;
};

/**
 * The model of the select.
 */
export type SelectModel = SelectValue | SelectValue[];

/**
 * The option of the select.
 */
export type SelectOption = ListboxOption;

/**
 * The input of the select.
 */
export type SelectOptionInput =
  | number
  | string
  | SelectOption
  | Record<string, unknown>;

/**
 * Object keys used to read option fields from arbitrary data.
 */
export type SelectOptionKeys = {
  optionDescription: string;
  optionLabel: string;
  optionValue: string;
};

/**
 * The like of the select option.
 */
export type SelectOptionLike = string | SelectOption | Record<string, unknown>;

/**
 * The value of the select.
 */
export type SelectValue = number | string;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Debounces async `search` calls while typing. Use `searchImmediate` on open.
 */
export function createSelectAsyncSearch(
  fetch: (query: string) => void,
  debounceMs: number,
): SelectAsyncSearch {
  const debouncedFetch = debounce(fetch, debounceMs);

  function cancel() {
    debouncedFetch.cancel();
  }

  function searchImmediate(query: string) {
    debouncedFetch.cancel();
    fetch(query);
  }

  function searchDebounced(query: string) {
    if (debounceMs <= 0) {
      debouncedFetch.cancel();
      fetch(query);
      return;
    }

    debouncedFetch(query);
  }

  return { cancel, searchDebounced, searchImmediate };
}

/**
 * Fetches async search and resolve payloads for the select.
 */
export async function fetchSelectAsyncData(
  asyncData: SelectAsyncData,
  query: string,
  selected: SelectValue[],
): Promise<{
  search: SelectOptionLike[];
  selected: SelectOptionLike[];
}> {
  const [search, selectedResults] = await Promise.all([
    asyncData.search(query, { selected }),
    selected.length > 0 && asyncData.resolve
      ? asyncData.resolve(selected)
      : Promise.resolve([]),
  ]);

  return { search, selected: selectedResults };
}

/**
 * Merges selected and search options, deduped by value, capped by `limit`.
 */
export function mergeSelectAsyncOptions<T extends { value: SelectValue }>(
  selected: T[],
  search: T[],
  limit = DEFAULT_SELECT_ASYNC_LIMIT,
): T[] {
  const seen = new Set<string>();
  const merged: T[] = [];

  const push = (option: T) => {
    const key = String(option.value);

    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    merged.push(option);
  };

  for (const option of selected) {
    push(option);
  }

  for (const option of search) {
    if (merged.length >= limit) {
      break;
    }

    push(option);
  }

  return merged;
}

/**
 * Normalizes a single select option input.
 */
export function normalizeSelectOption(
  item: SelectOptionInput,
  keys: SelectOptionKeys,
): SelectOption {
  if (typeof item === "string" || typeof item === "number") {
    const label = String(item);

    return { label, value: item };
  }

  if (isRecord(item) && "label" in item && "value" in item) {
    return {
      raw: item,
      label: String(item.label),
      value: item.value as SelectValue,
      disabled: Boolean(item.disabled),
      description: item.description ? String(item.description) : undefined,
    };
  }

  if (isRecord(item)) {
    const label = String(get(item, keys.optionLabel, ""));
    const description = get(item, keys.optionDescription);
    const value = get(item, keys.optionValue) as SelectValue;

    return {
      label,
      value,
      raw: item,
      disabled: Boolean(get(item, "disabled", false)),
      description: isNil(description) ? undefined : String(description),
    };
  }

  return { label: "", value: "" };
}

/**
 * Normalizes a list of select option inputs.
 */
export function normalizeSelectOptions(
  items: SelectOptionInput[] | SelectOptionLike[] | undefined,
  keys: SelectOptionKeys,
): SelectOption[] {
  if (!items?.length) {
    return [];
  }

  return items.map((item) =>
    normalizeSelectOption(item as SelectOptionInput, keys),
  );
}

/**
 * Resolves the async search debounce delay for the select.
 */
export function resolveSelectAsyncDebounce(asyncData: SelectAsyncData) {
  return asyncData.debounce ?? DEFAULT_SELECT_ASYNC_DEBOUNCE;
}

/**
 * Resolves the async results limit for the select.
 */
export function resolveSelectAsyncLimit(asyncData: SelectAsyncData) {
  return asyncData.limit ?? DEFAULT_SELECT_ASYNC_LIMIT;
}

/**
 * Fetches, normalizes, and merges async select options.
 */
export async function resolveSelectAsyncOptions<T extends SelectOption>(
  asyncData: SelectAsyncData,
  query: string,
  selected: SelectValue[],
  normalize: (items: SelectOptionLike[]) => T[],
): Promise<{
  options: T[];
  resolvedSelected: T[];
}> {
  const { search, selected: selectedItems } = await fetchSelectAsyncData(
    asyncData,
    query,
    selected,
  );

  const normalizedSearch = normalize(search);
  const normalizedSelected = normalize(selectedItems);
  const limit = resolveSelectAsyncLimit(asyncData);

  return {
    resolvedSelected: normalizedSelected,
    options: mergeSelectAsyncOptions(
      normalizedSelected,
      normalizedSearch,
      limit,
    ),
  };
}

/**
 * Checks if two select values are equal.
 */
export function selectValuesEqual(a: SelectValue, b: SelectValue) {
  return String(a) === String(b);
}
