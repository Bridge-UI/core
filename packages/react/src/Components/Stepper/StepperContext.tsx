// ** External Imports
import { createContext, useContext } from "react";

// ** Core Imports
import type {
  StepperColorItem,
  StepperOrientationItem,
  StepperSizeItem,
} from "@bridge-ui/core/Tokens";

/**
 * Per-step flags registered during render for click / keyboard gating.
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
 * Shared stepper state for `Step` children.
 */
export type StepperContextValue = {
  /**
   * Controlled / uncontrolled 0-based active index.
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
   * Records clickable / disabled for an index (render-time).
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

  /**
   * Allocates the next 0-based index during render.
   */
  takeIndex: () => number;
};

export const StepperContext = createContext<null | StepperContextValue>(null);

/**
 * Reads the nearest `Stepper` context. Throws when used outside `Stepper`.
 */
export function useStepperContext(): StepperContextValue {
  const context = useContext(StepperContext);

  if (!context) {
    throw new Error("Step must be used within a Stepper provider");
  }

  return context;
}
