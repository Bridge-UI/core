// ** External Imports
import type { ComputedRef, InjectionKey } from "vue";

// ** Core Imports
import type {
  StepperColorItem,
  StepperOrientationItem,
  StepperSizeItem,
} from "@bridge-ui/core/Tokens";

/**
 * Per-step flags registered for click / keyboard gating.
 */
export type StepperStepMeta = {
  /**
   * Whether the step may be selected.
   */
  clickable: boolean;

  /**
   * Whether the step is disabled.
   */
  disabled: boolean;
};

/**
 * Shared stepper state for `Step` descendants.
 */
export type StepperContextValue = {
  /**
   * Bound 0-based active index.
   */
  activeStep: number;

  /**
   * Accent color item for the stepper `color` token.
   */
  colorItem: undefined | StepperColorItem;

  /**
   * Error palette (used when a step has `error`).
   */
  errorColorItem: undefined | StepperColorItem;

  /**
   * Focus a step trigger by index.
   */
  focusStep: (index: number) => void;

  /**
   * Next enabled, clickable index from `from`, wrapping around.
   */
  getAdjacentIndex: (from: number, direction: 1 | -1) => number;

  /**
   * Resolves a registered step's 0-based index.
   */
  getIndex: (id: string) => number;

  /**
   * Stable id prefix for step / content pairing.
   */
  id: string;

  /**
   * When true, block jumping ahead of incomplete steps.
   */
  linear: boolean;

  /**
   * Layout direction token key.
   */
  orientation: string;

  /**
   * Orientation class map.
   */
  orientationItem: undefined | StepperOrientationItem;

  /**
   * Registers a step id and returns unregister.
   */
  registerStep: (id: string) => () => void;

  /**
   * Records clickable / disabled for an index.
   */
  registerStepMeta: (index: number, meta: StepperStepMeta) => void;

  /**
   * Selects a step when clickable.
   */
  selectStep: (index: number) => void;

  /**
   * Size class map.
   */
  sizeItem: undefined | StepperSizeItem;
};

export const STEPPER_INJECTION_KEY = Symbol("bridge-stepper") as InjectionKey<
  ComputedRef<StepperContextValue>
>;
