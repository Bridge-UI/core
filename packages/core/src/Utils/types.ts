/**
 * The key of the class property in the props object.
 *
 * @internal
 */
export type ClassPropKey = "class" | "className";

/**
 * Merges the bridge props with the part props and returns the merged props.
 * The class property is merged using the `cn` function.
 *
 * @internal
 */
export type MergePartBind<
  Bridge extends object,
  K extends ClassPropKey = ClassPropKey,
  Part extends object | undefined = undefined,
> = Bridge & (Part extends undefined ? object : Part) & Record<K, string>;

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

/**
 * Own props plus native HTML attributes for the root element.
 * Pass framework `HTMLAttributes` as the second argument (React, Vue, etc.).
 */
export type MergeHtmlProps<
  OwnProps extends object,
  HtmlAttributes extends object,
> = OwnProps & Omit<HtmlAttributes, keyof OwnProps>;
