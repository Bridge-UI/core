/**
 * Unique identifier for a layer.
 */
export type LayerId = string;

/**
 * Base shape for imperative layers hosted by Bridge UI (Modal, Dialog, Snackbar, …).
 */
export type LayerRegistryEntry = {
  id: LayerId;
  onClose?: () => void;
  onClosed?: () => void;
  show: boolean;
};

/**
 * Partial update payload for a layer entry.
 */
export type LayerPatch<T extends LayerRegistryEntry> = Partial<Omit<T, "id">>;

/**
 * Update payload with shallow-mergable nested objects (e.g. `props`, `modal`).
 */
export type LayerUpdatePatch<T extends LayerRegistryEntry> = Partial<{
  [K in keyof LayerPatch<T>]: NonNullable<LayerPatch<T>[K]> extends Record<
    string,
    unknown
  >
    ? Partial<NonNullable<LayerPatch<T>[K]>>
    : LayerPatch<T>[K];
}>;
