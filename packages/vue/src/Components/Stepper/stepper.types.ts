// ** External Imports
import type { HTMLAttributes, OlHTMLAttributes, Slot } from "vue";

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
  list?: OlHTMLAttributes;

  /**
   * Props forwarded to the nav root.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

export interface StepperEmits {
  /**
   * Emitted when the active index changes.
   */
  change: [step: number];

  /**
   * Emitted when `v-model` should update.
   */
  "update:modelValue": [step: number];
}

/**
 * Multi-step flow indicator. Compose with `Step`.
 */
export interface StepperOwnProps {
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
   * Block jumping ahead of incomplete steps.
   *
   * @default true
   */
  linear?: boolean;

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

export interface StepperSlots {
  /**
   * The children to render (`Step`, etc.).
   */
  default?: Slot<undefined>;
}

export type StepperProps = MergeHtmlProps<StepperOwnProps, HTMLAttributes> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: number;
};
