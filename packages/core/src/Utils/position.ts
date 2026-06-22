// ** External Imports
import {
  autoUpdate,
  computePosition,
  flip,
  hide,
  offset,
  shift,
  type Placement,
} from "@floating-ui/dom";

// ** Local Imports
import { hasDocument } from "@/Utils/env";

/**
 * The strategy to use for the positionable.
 */
export type PositionStrategy = "absolute" | "fixed";

/**
 * Options for the positionable.
 */
export type PositionOptions = {
  floating: HTMLElement;
  offset?: number;
  onReferenceHidden?: () => void;
  placement?: Placement;
  reference: HTMLElement;
  strategy?: PositionStrategy;
};

/**
 * A handle for the positionable.
 */
export type PositionHandle = {
  destroy: () => void;
  setOffset: (value: number) => void;
  setPlacement: (placement: Placement) => void;
  setStrategy: (strategy: PositionStrategy) => void;
  start: () => void;
  update: () => Promise<void>;
};

/**
 * Anchors a floating element to a reference using Floating UI (Menu, Popover, etc.).
 */
export function createPositionable(options: PositionOptions): PositionHandle {
  const floating = options.floating;
  const reference = options.reference;
  const onReferenceHidden = options.onReferenceHidden;

  let offsetValue = options.offset ?? 4;
  let cleanup: (() => void) | null = null;
  let strategy: PositionStrategy = options.strategy ?? "fixed";
  let placement: Placement = options.placement ?? "bottom-start";

  async function computeAndApply() {
    if (!hasDocument()) {
      return;
    }

    const result = await computePosition(reference, floating, {
      strategy,
      placement,
      middleware: [
        offset(offsetValue),
        flip({ padding: 8 }),
        shift({ padding: 8 }),
        hide({ padding: -100 }),
      ],
    });

    if (result.middlewareData.hide?.referenceHidden) {
      onReferenceHidden?.();
    }

    Object.assign(floating.style, {
      position: strategy,
      top: `${result.y}px`,
      left: `${result.x}px`,
    });
  }

  return {
    setOffset(value) {
      offsetValue = value;
    },
    async update() {
      await computeAndApply();
    },
    destroy() {
      cleanup?.();
      cleanup = null;
    },
    setStrategy(nextStrategy) {
      strategy = nextStrategy;
    },
    setPlacement(nextPlacement) {
      placement = nextPlacement;
    },
    start() {
      if (!hasDocument()) {
        return;
      }

      cleanup?.();
      cleanup = autoUpdate(reference, floating, () => {
        void computeAndApply();
      });
    },
  };
}

/** Floating UI placement alias re-exported from `@floating-ui/dom`. */
export type { Placement as PositionPlacement };
