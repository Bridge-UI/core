// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

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
  panel?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the item shell.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the title wrapper.
   *
   * @default undefined
   */
  title?: HTMLAttributes<HTMLSpanElement>;

  /**
   * Props forwarded to the trigger button.
   *
   * @default undefined
   */
  trigger?: ButtonHTMLAttributes<HTMLButtonElement>;
}

/**
 * One accordion section (trigger + panel). Must be used inside `Accordion`.
 */
export interface AccordionItemOwnProps {
  /**
   * Panel content.
   *
   * @default undefined
   */
  children?: ReactNode;

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
   * Custom title / indicator slots.
   *
   * @default undefined
   */
  slots?: AccordionItemSlots;

  /**
   * Trigger label.
   *
   * @default undefined
   */
  title?: ReactNode;

  /**
   * Stable id for expanded state.
   */
  value: string;
}

export interface AccordionItemSlots {
  /**
   * Custom expand indicator (defaults to chevron icon).
   */
  indicator?: ReactNode;

  /**
   * Custom title content (overrides `title` prop when set).
   */
  title?: ReactNode;
}

export type AccordionItemProps = MergeHtmlProps<
  AccordionItemOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
