// ** External Imports
import { isEmpty, isNil, isString } from "es-toolkit/compat";

/**
 * Whether a prop value is considered present for fallback rendering.
 */
export function isPropPresent(value: unknown): boolean {
  if (isNil(value)) {
    return false;
  }

  if (isString(value)) {
    return !isEmpty(value);
  }

  return true;
}

/**
 * Whether a snippet or a fallback prop should render (snippet wins).
 */
export function hasSnippetOrProp(snippet: unknown, prop: unknown): boolean {
  return !isNil(snippet) || isPropPresent(prop);
}
