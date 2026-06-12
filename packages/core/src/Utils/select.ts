// ** External Imports
import { get, isNil } from "es-toolkit/compat";

// ** Local Imports
import type {
  SelectAsyncData,
  SelectOption,
  SelectOptionInput,
  SelectOptionLike,
  SelectValue,
} from "@core/Components/Select/types";

export const DEFAULT_SELECT_ASYNC_RESULTS_LIMIT = 20;

export type SelectOptionKeys = {
  optionDescription: string;
  optionLabel: string;
  optionValue: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

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

export function selectValuesEqual(a: SelectValue, b: SelectValue) {
  return String(a) === String(b);
}

export function resolveSelectAsyncLimit(asyncData: SelectAsyncData) {
  return asyncData.limit ?? DEFAULT_SELECT_ASYNC_RESULTS_LIMIT;
}

export function mergeSelectAsyncOptions<T extends { value: SelectValue }>(
  selected: T[],
  search: T[],
  limit = DEFAULT_SELECT_ASYNC_RESULTS_LIMIT,
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
    selected.length > 0 && asyncData.resolveSelected
      ? asyncData.resolveSelected(selected)
      : Promise.resolve([]),
  ]);

  return { search, selected: selectedResults };
}

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
