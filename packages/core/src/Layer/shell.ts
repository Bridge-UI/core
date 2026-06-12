// ** External Imports
import { toMerged } from "es-toolkit/object";

type LayerShellShape = {
  classes?: object;
  customProps?: object;
};

/**
 * Merges host-level shell defaults with per-entry options (`open()` / `modal` / `snackbar`).
 * Entry values win; `classes` and `customProps` are shallow-merged per key.
 */
export function mergeLayerShellProps<T extends LayerShellShape>(
  host?: Partial<T>,
  entry?: Partial<T>,
): Partial<T> {
  if (!host && !entry) {
    return {};
  }

  if (!host) {
    return (entry ? { ...entry } : {}) as Partial<T>;
  }

  if (!entry) {
    return { ...host } as Partial<T>;
  }

  const merged = toMerged(host, entry) as Partial<T>;

  if (host.classes || entry.classes) {
    merged.classes = {
      ...host.classes,
      ...entry.classes,
    } as T["classes"];
  }

  if (host.customProps || entry.customProps) {
    merged.customProps = toMerged(
      host.customProps ?? {},
      entry.customProps ?? {},
    ) as T["customProps"];
  }

  return merged;
}
