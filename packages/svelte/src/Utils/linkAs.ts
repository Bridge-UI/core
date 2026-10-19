// ** External Imports
import { isNil } from "es-toolkit/compat";
import type { Component, ComponentProps } from "svelte";

/**
 * Tag or component accepted by `linkAs`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any router link component
export type LinkAsTag = string | Component<any>;

const linkAsReservedProps = ["href", "class", "style", "children"] as const;

type LinkAsReservedProp = (typeof linkAsReservedProps)[number];

const linkAsReservedPropSet = new Set<string>(linkAsReservedProps);

/**
 * Props of a component passed to `linkAs`. String tags have none.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any router link component
type SvelteComponentProps<T> =
  T extends Component<any> ? ComponentProps<T> : Record<never, never>;

/**
 * `href` of `T`, or `string` when `T` is still the default tag.
 */
export type LinkHref<T extends LinkAsTag, DefaultTag extends LinkAsTag> = [
  T,
] extends [DefaultTag]
  ? string
  : "href" extends keyof SvelteComponentProps<T>
    ? SvelteComponentProps<T>["href"]
    : string;

/**
 * Props of `linkAs`, excluding the ones Bridge already sets.
 * `never` when `linkAs` is omitted.
 */
export type LinkPropsOf<T extends LinkAsTag, DefaultTag extends LinkAsTag> = [
  T,
] extends [DefaultTag]
  ? never
  : Omit<SvelteComponentProps<T>, LinkAsReservedProp>;

/**
 * Props to put on `linkAs`. Empty when that component is not the rendered tag.
 */
export function resolveLinkAsProps(
  linkAs: unknown,
  linkProps: object | undefined,
  rendered: unknown,
): undefined | Record<string, unknown> {
  if (isNil(linkAs) || isNil(linkProps) || rendered !== linkAs) {
    return undefined;
  }

  const forwarded: Record<string, unknown> = {};
  const source = linkProps as Record<string, unknown>;

  for (const key of Object.keys(source)) {
    if (linkAsReservedPropSet.has(key)) {
      continue;
    }

    forwarded[key] = source[key];
  }

  return forwarded;
}
