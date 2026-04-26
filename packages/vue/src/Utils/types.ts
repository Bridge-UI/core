/**
 * Shallow merge of object types: keys in `Overrides` replace keys in `Base`.
 *
 * @internal
 */
export type Overwrite<
  Base extends object,
  Overrides extends object,
> = keyof Overrides extends never
  ? Base
  : Omit<Base, keyof Overrides> & Overrides;

/**
 * Union of keys on {@link Overwrite}, i.e. keys from `Base` plus any keys
 * introduced or kept via `Overrides` (for example declaration merging on an
 * empty overrides interface).
 *
 * @internal
 */
export type MergeProps<
  Base extends object,
  Overrides extends object,
> = keyof Overwrite<Base, Overrides>;

/**
 * Fixed union of property keys `Base`, plus any keys from `Overrides` (e.g.
 * declaration merging on an empty overrides interface).
 *
 * @internal
 */
export type UnionProps<Base extends PropertyKey, Overrides extends object> =
  | Base
  | keyof Overrides;
