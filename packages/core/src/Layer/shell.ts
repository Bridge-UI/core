// ** External Imports
import { toMerged } from "es-toolkit/object";

type LayerShellShape = {
  classes?: object;
  partsProps?: object;
};

/**
 * Merges host-level shell defaults with per-entry options (`open()` / `modal` / `snackbar`).
 * Entry values win; `classes` and `partsProps` are shallow-merged per key.
 */
export function mergeLayerShellProps<T extends LayerShellShape>(
  host?: Partial<T>,
  entry?: Partial<T>,
): Partial<T> {
  if (!host && !entry) {
    return {};
  }

  if (!host) {
    return { ...entry };
  }

  if (!entry) {
    return { ...host };
  }

  const merged = toMerged(host, entry) as Partial<T>;

  if (host.classes || entry.classes) {
    merged.classes = {
      ...host.classes,
      ...entry.classes,
    } as T["classes"];
  }

  if (host.partsProps || entry.partsProps) {
    merged.partsProps = toMerged(
      host.partsProps,
      entry.partsProps,
    ) as T["partsProps"];
  }

  return merged;
}
