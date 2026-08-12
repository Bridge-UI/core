// ** External Imports
import type { ComputedRef, InjectionKey, VNodeChild } from "vue";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type { IconProps } from "@/Components/Icon";

/**
 * Shared breadcrumb chrome for `BreadcrumbItem` descendants.
 */
export type BreadcrumbContextValue = {
  /**
   * Separator icon when no custom separator slot is set.
   */
  separator: IconSource;

  /**
   * Classes merged onto each separator from the root.
   */
  separatorClass?: string;

  /**
   * Extra props for the default separator `Icon`.
   */
  separatorIconProps?: Partial<Omit<IconProps, "icon">>;

  /**
   * Custom separator content from the root `separator` slot.
   */
  separatorSlot?: () => VNodeChild;

  /**
   * Merged token classes for items / links / separators.
   */
  tokenClasses: {
    current?: string;
    iconSize?: string;
    item?: string;
    link?: string;
    separator?: string;
  };
};

export const BREADCRUMB_INJECTION_KEY = Symbol(
  "bridge-breadcrumb",
) as InjectionKey<ComputedRef<BreadcrumbContextValue>>;
