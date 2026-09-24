// ** External Imports
import type { AllowedComponentProps, Component, VNodeProps } from "vue";

/**
 * Tag or component accepted by `linkAs`.
 */
export type LinkAsTag = string | Component;

const linkAsReservedProps = [
  "ref",
  "href",
  "class",
  "style",
  "children",
  "className",
] as const;

type LinkAsReservedProp = (typeof linkAsReservedProps)[number];

const linkAsReservedPropSet = new Set<string>(linkAsReservedProps);

/**
 * `$props` of a component constructor, or the first argument of a function component.
 */
type VueComponentProps<T> = T extends new (
  // Constructor args vary; only `$props` is read.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => { $props: infer Props }
  ? Props
  : T extends (
        props: infer Props,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...args: any[]
      ) => unknown
    ? Props
    : Record<never, never>;

/**
 * `href` of `T`, or `string` when `T` is still the default tag.
 */
export type LinkHref<T extends LinkAsTag, DefaultTag extends LinkAsTag> = [
  T,
] extends [DefaultTag]
  ? string
  : "href" extends keyof VueComponentProps<T>
    ? VueComponentProps<T>["href"]
    : string;

/**
 * Props of `linkAs`, excluding the ones Bridge already sets.
 * `never` when `linkAs` is omitted.
 */
export type LinkPropsOf<T extends LinkAsTag, DefaultTag extends LinkAsTag> = [
  T,
] extends [DefaultTag]
  ? never
  : Omit<
      VueComponentProps<T>,
      keyof VNodeProps | LinkAsReservedProp | keyof AllowedComponentProps
    >;

/**
 * Props to put on `linkAs`. Empty when that component is not the rendered tag.
 */
export function resolveLinkAsProps(
  linkAs: unknown,
  linkProps: object | undefined,
  rendered: unknown,
): undefined | Record<string, unknown> {
  if (linkAs == null || linkProps == null || rendered !== linkAs) {
    return undefined;
  }

  const source = linkProps as Record<string, unknown>;
  const forwarded: Record<string, unknown> = {};

  for (const key of Object.keys(source)) {
    if (linkAsReservedPropSet.has(key)) {
      continue;
    }

    forwarded[key] = source[key];
  }

  return forwarded;
}
