// ** External Imports
import type { HTMLAttributes, OlHTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  StepperColor,
  StepperOrientation,
  StepperSize,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

export interface StepperSizeOverrides {}
export interface StepperColorOverrides {}
export interface StepperOrientationOverrides {}

export interface StepperClasses {
  /**
   * Classes merged onto the ordered list.
   */
  list?: string;

  /**
   * Classes merged onto the nav root.
   */
  root?: string;
}

export interface StepperCustomProps {
  /**
   * Props forwarded to the ordered list.
   *
   * @default undefined
   */
  list?: OlHTMLAttributes<HTMLOListElement>;

  /**
   * Props forwarded to the nav root.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLElement>;
}

/**
 * Multi-step flow indicator. Compose with `Step`.
 */
export interface StepperOwnProps {
  /**
   * Controlled 0-based active index.
   *
   * @default undefined
   */
  activeStep?: number;

  /**
   * The children to render (`Step`, etc.).
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for stepper parts.
   *
   * @default undefined
   */
  classes?: StepperClasses;

  /**
   * Accent color for active / completed steps.
   *
   * @default "primary"
   */
  color?: MergeProps<StepperColor, StepperColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: StepperCustomProps;

  /**
   * Initial active index when uncontrolled.
   *
   * @default 0
   */
  defaultActiveStep?: number;

  /**
   * Block jumping ahead of incomplete steps.
   *
   * @default true
   */
  linear?: boolean;

  /**
   * Called when the active index changes.
   *
   * @default undefined
   */
  onChange?: (step: number) => void;

  /**
   * Layout direction.
   *
   * @default "horizontal"
   */
  orientation?: MergeProps<StepperOrientation, StepperOrientationOverrides>;

  /**
   * Indicator and label scale.
   *
   * @default "md"
   */
  size?: MergeProps<StepperSize, StepperSizeOverrides>;
}

export type StepperProps = MergeHtmlProps<
  StepperOwnProps,
  HTMLAttributes<HTMLElement>
>;
