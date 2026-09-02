// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { AccordionValue } from "@bridge-ui/core/Domain";
import type {
  AccordionColor,
  AccordionSize,
  AccordionVariant,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

export interface AccordionSizeOverrides {}
export interface AccordionColorOverrides {}
export interface AccordionVariantOverrides {}

export interface AccordionClasses {
  /**
   * Classes merged onto the root.
   */
  root?: string;
}

export interface AccordionCustomProps {
  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Accordion context root. Compose with `AccordionItem`.
 */
export interface AccordionOwnProps {
  /**
   * The children to render (`AccordionItem`, etc.).
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for accordion parts.
   *
   * @default undefined
   */
  classes?: AccordionClasses;

  /**
   * Optional text accent for the expanded trigger and indicator.
   *
   * @default "dark"
   */
  color?: MergeProps<AccordionColor, AccordionColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: AccordionCustomProps;

  /**
   * Initial expanded value(s) when uncontrolled.
   *
   * @default undefined
   */
  defaultValue?: AccordionValue;

  /**
   * Disable all items.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Allow more than one item expanded at once.
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Called when the expanded value(s) change.
   *
   * @default undefined
   */
  onChange?: (value: AccordionValue) => void;

  /**
   * Density of triggers and content.
   *
   * @default "md"
   */
  size?: MergeProps<AccordionSize, AccordionSizeOverrides>;

  /**
   * Controlled expanded value(s).
   *
   * @default undefined
   */
  value?: AccordionValue;

  /**
   * Visual layout: flush (`default`), boxed (`outlined`), quiet (`plain`), or cards (`separated`).
   *
   * @default "default"
   */
  variant?: MergeProps<AccordionVariant, AccordionVariantOverrides>;
}

export type AccordionProps = MergeHtmlProps<
  AccordionOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
