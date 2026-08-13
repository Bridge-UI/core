// ** External Imports
import { createContext, useContext, type ReactNode } from "react";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type { IconProps } from "@/Components/Icon";

/**
 * Shared breadcrumb chrome for `BreadcrumbItem` children.
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
   * Custom separator content from the root `slots.separator`.
   */
  separatorSlot?: ReactNode;

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

export const BreadcrumbContext = createContext<null | BreadcrumbContextValue>(
  null,
);

/**
 * Reads the nearest `Breadcrumb` context. Throws when used outside `Breadcrumb`.
 */
export function useBreadcrumbContext(): BreadcrumbContextValue {
  const context = useContext(BreadcrumbContext);

  if (!context) {
    throw new Error("BreadcrumbItem must be used within a Breadcrumb provider");
  }

  return context;
}
