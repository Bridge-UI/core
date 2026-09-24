// ** External Imports
import type { ComponentPropsWithoutRef, ElementType } from "react";

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
 * `href` of `T`, or `string` when `T` is still the default tag.
 */
export type LinkHref<T extends ElementType, DefaultTag extends ElementType> = [
  T,
] extends [DefaultTag]
  ? string
  : "href" extends keyof ComponentPropsWithoutRef<T>
    ? ComponentPropsWithoutRef<T>["href"]
    : string;

/**
 * Props of `linkAs`, excluding the ones Bridge already sets.
 * `never` when `linkAs` is omitted.
 */
export type LinkPropsOf<
  T extends ElementType,
  DefaultTag extends ElementType,
> = [T] extends [DefaultTag]
  ? never
  : Omit<ComponentPropsWithoutRef<T>, LinkAsReservedProp>;

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
