// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type { IconProps } from "@/Components/Icon";

export interface StepClasses {
  /**
   * Classes merged onto the connector line.
   */
  connector?: string;

  /**
   * Classes merged onto optional vertical body content.
   */
  content?: string;

  /**
   * Classes merged onto the description.
   */
  description?: string;

  /**
   * Classes merged onto the indicator icon.
   */
  icon?: string;

  /**
   * Classes merged onto the circle / number indicator.
   */
  indicator?: string;

  /**
   * Classes merged onto the step title.
   */
  label?: string;

  /**
   * Classes merged onto the list item.
   */
  root?: string;

  /**
   * Classes merged onto the step trigger.
   */
  trigger?: string;
}

export interface StepCustomProps {
  /**
   * Props forwarded to the connector line.
   *
   * @default undefined
   */
  connector?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to optional vertical body content.
   *
   * @default undefined
   */
  content?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the description.
   *
   * @default undefined
   */
  description?: HTMLAttributes<HTMLSpanElement>;

  /**
   * Props forwarded to the indicator `Icon`.
   *
   * @default undefined
   */
  icon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the circle / number indicator.
   *
   * @default undefined
   */
  indicator?: HTMLAttributes<HTMLSpanElement>;

  /**
   * Props forwarded to the step title.
   *
   * @default undefined
   */
  label?: HTMLAttributes<HTMLSpanElement>;

  /**
   * Props forwarded to the list item.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLLIElement>;

  /**
   * Props forwarded to the step trigger.
   *
   * @default undefined
   */
  trigger?: ButtonHTMLAttributes<HTMLButtonElement>;
}

/**
 * One step in a `Stepper`. Must be used inside `Stepper`.
 */
export interface StepOwnProps {
  /**
   * Optional body shown under the step when `orientation="vertical"` and active.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for step parts.
   *
   * @default undefined
   */
  classes?: StepClasses;

  /**
   * Force completed state (else derived from index vs `activeStep`).
   *
   * @default undefined
   */
  completed?: boolean;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: StepCustomProps;

  /**
   * Secondary text under the label.
   *
   * @default undefined
   */
  description?: ReactNode;

  /**
   * Non-interactive step.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Error styling on the indicator.
   *
   * @default false
   */
  error?: boolean;

  /**
   * Override the default numeric / check indicator.
   *
   * @default undefined
   */
  icon?: IconSource;

  /**
   * Step title.
   *
   * @default undefined
   */
  label?: ReactNode;

  /**
   * Custom icon / label / description slots.
   *
   * @default undefined
   */
  slots?: StepSlots;
}

export interface StepSlots {
  /**
   * Custom description (overrides `description` when set).
   */
  description?: ReactNode;

  /**
   * Custom indicator content (overrides number / check / `icon`).
   */
  icon?: ReactNode;

  /**
   * Custom title (overrides `label` when set).
   */
  label?: ReactNode;
}

export type StepProps = MergeHtmlProps<
  StepOwnProps,
  HTMLAttributes<HTMLLIElement>
>;
