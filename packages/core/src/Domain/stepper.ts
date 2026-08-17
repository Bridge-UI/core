/**
 * Visual status of a step relative to `activeStep`.
 */
export type StepperStepStatus = "error" | "active" | "upcoming" | "completed";

/**
 * Options for resolving whether a step is completed.
 */
export type ResolveStepperStepCompletedOptions = {
  /**
   * Controlled 0-based active index.
   */
  activeStep: number;

  /**
   * Force completed (`true`) or incomplete (`false`). Omit to derive from index.
   */
  completed?: boolean;

  /**
   * 0-based step index.
   */
  index: number;
};

/**
 * Options for resolving a step's visual status.
 */
export type ResolveStepperStepStatusOptions =
  ResolveStepperStepCompletedOptions & {
    /**
     * Force error styling on the indicator.
     */
    error?: boolean;
  };

/**
 * Options for whether a step may be selected by click or keyboard.
 */
export type IsStepperStepClickableOptions =
  ResolveStepperStepCompletedOptions & {
    /**
     * When true, the step cannot be selected.
     */
    disabled?: boolean;

    /**
     * When true, block jumping ahead of incomplete steps.
     */
    linear: boolean;
  };

/**
 * Stable DOM id for a step trigger.
 */
export function getStepperStepId(stepperId: string, index: number): string {
  return `${stepperId}-step-${index}`;
}

/**
 * Stable DOM id for optional vertical step content.
 */
export function getStepperStepContentId(
  stepperId: string,
  index: number,
): string {
  return `${stepperId}-content-${index}`;
}

/**
 * Whether `index` is completed given `activeStep` and an optional override.
 */
export function isStepperStepCompleted(
  options: ResolveStepperStepCompletedOptions,
): boolean {
  if (options.completed === true) {
    return true;
  }

  if (options.completed === false) {
    return false;
  }

  return options.index < options.activeStep;
}

/**
 * Resolves completed / active / upcoming / error for a step.
 * `error` wins over completed and active.
 */
export function resolveStepperStepStatus(
  options: ResolveStepperStepStatusOptions,
): StepperStepStatus {
  if (options.error) {
    return "error";
  }

  if (isStepperStepCompleted(options)) {
    return "completed";
  }

  if (options.index === options.activeStep) {
    return "active";
  }

  return "upcoming";
}

/**
 * Whether the step can be selected. Linear mode allows the current step,
 * previous steps, and any step forced completed — not incomplete upcoming ones.
 */
export function isStepperStepClickable(
  options: IsStepperStepClickableOptions,
): boolean {
  if (options.disabled) {
    return false;
  }

  if (!options.linear) {
    return true;
  }

  return options.index <= options.activeStep || isStepperStepCompleted(options);
}

/**
 * Display number for a 0-based step index (1-based, no padding).
 */
export function formatStepperStepNumber(index: number): string {
  return String(index + 1);
}

/**
 * Next enabled, clickable step index from `current`, wrapping around.
 * When none are enabled, returns `current`.
 */
export function getAdjacentStepperIndex(
  count: number,
  current: number,
  direction: 1 | -1,
  blocked: ReadonlySet<number> = new Set(),
): number {
  if (count <= 0) {
    return current;
  }

  let next = current;

  for (let i = 0; i < count; i += 1) {
    next = (next + direction + count) % count;

    if (!blocked.has(next)) {
      return next;
    }
  }

  return current;
}
