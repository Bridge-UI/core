// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";

export interface AccordionItemClasses {
  /**
   * Classes merged onto the expand indicator icon.
   */
  indicator?: string;

  /**
   * Classes merged onto the panel region.
   */
  panel?: string;

  /**
   * Classes merged onto the item shell.
   */
  root?: string;

  /**
   * Classes merged onto the title text wrapper.
   */
  title?: string;

  /**
   * Classes merged onto the trigger button.
   */
  trigger?: string;
}

export interface AccordionItemCustomProps {
  /**
   * Props forwarded to the expand indicator `Icon`.
   *
   * @default undefined
   */
  indicator?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the panel region.
   *
   * @default undefined
   */
  panel?: HTMLAttributes;

  /**
   * Props forwarded to the item shell.
   *
   * @default undefined
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the title wrapper.
   *
   * @default undefined
   */
  title?: HTMLAttributes;

  /**
   * Props forwarded to the trigger button.
   *
   * @default undefined
   */
  trigger?: ButtonHTMLAttributes;
}

/**
 * One accordion section (trigger + panel). Must be used inside `Accordion`.
 */
export interface AccordionItemOwnProps {
  /**
   * Classes for accordion item parts.
   *
   * @default undefined
   */
  classes?: AccordionItemClasses;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: AccordionItemCustomProps;

  /**
   * Disable this item.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Trigger label (prefer `#title` slot when set).
   *
   * @default undefined
   */
  title?: string;

  /**
   * Stable id for expanded state.
   */
  value: string;
}

export interface AccordionItemSlots {
  /**
   * Panel content.
   */
  default?: Slot<undefined>;

  /**
   * Custom expand indicator (defaults to chevron icon).
   */
  indicator?: Slot<undefined>;

  /**
   * Custom title content (overrides `title` prop when set).
   */
  title?: Slot<undefined>;
}

export type AccordionItemProps = MergeHtmlProps<
  AccordionItemOwnProps,
  HTMLAttributes
>;
