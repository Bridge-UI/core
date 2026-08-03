// ** External Imports
import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  hide,
  offset,
  shift,
  type Placement,
} from "@floating-ui/dom";
import { constant, isFunction } from "es-toolkit/compat";

// ** Local Imports
import { hasDocument } from "@/Utils/env";

/**
 * The strategy to use for the positionable.
 */
export type PositionStrategy = "fixed" | "absolute";

/**
 * Options for the positionable.
 */
export type PositionOptions = {
  arrow?: HTMLElement | (() => null | undefined | HTMLElement);
  floating: HTMLElement;
  offset?: number;
  onReferenceHidden?: () => void;
  placement?: Placement;
  reference: HTMLElement;
  shiftCrossAxis?: boolean;
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
 * Inset for edge-aligned (`-start` / `-end`) arrows. Too large (~12) looks
 * centered on short tooltips; too small (~4) sits on the corner.
 */
const ARROW_EDGE_INSET_PX = 8;

/**
 * Half of the default 8px arrow (`size-2`) — keeps the tip flush with the panel edge.
 */
const ARROW_STATIC_SIDE_OFFSET = "-4px";

/**
 * Anchors a floating element to a reference using Floating UI (Menu, Popover, etc.).
 */
export function createPositionable(options: PositionOptions): PositionHandle {
  const floating = options.floating;
  const reference = options.reference;
  const onReferenceHidden = options.onReferenceHidden;
  const shiftCrossAxis = options.shiftCrossAxis ?? true;

  let offsetValue = options.offset ?? 4;
  let cleanup: null | (() => void) = null;
  let strategy: PositionStrategy = options.strategy ?? "fixed";
  let placement: Placement = options.placement ?? "bottom-start";

  const resolveArrow = isFunction(options.arrow)
    ? options.arrow
    : constant(options.arrow);

  async function computeAndApply() {
    if (!hasDocument()) {
      return;
    }

    const arrowEl = resolveArrow() ?? undefined;

    const middleware = [
      offset(offsetValue),
      flip({ padding: 8, flipAlignment: false }),
      shift({ padding: 8, crossAxis: shiftCrossAxis }),
      hide({ padding: -100 }),
    ];

    if (arrowEl) {
      middleware.splice(
        3,
        0,
        arrow({ element: arrowEl, padding: ARROW_EDGE_INSET_PX }),
      );
    }

    const result = await computePosition(reference, floating, {
      strategy,
      placement,
      middleware,
    });

    if (result.middlewareData.hide?.referenceHidden) {
      onReferenceHidden?.();
    }

    Object.assign(floating.style, {
      position: strategy,
      top: `${result.y}px`,
      left: `${result.x}px`,
    });

    if (arrowEl && result.middlewareData.arrow) {
      Object.assign(
        arrowEl.style,
        getArrowStyles({
          placement: result.placement,
          arrowX: result.middlewareData.arrow.x,
          arrowY: result.middlewareData.arrow.y,
        }),
      );
    }
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

type ArrowSide = "top" | "left" | "right" | "bottom";

/**
 * Builds arrow inline styles for the final Floating UI placement.
 */
function getArrowStyles(options: {
  arrowX: number | undefined;
  arrowY: number | undefined;
  placement: Placement;
}) {
  const { arrowX, arrowY, placement } = options;

  const [side, alignment] = placement.split("-") as [
    ArrowSide,
    "end" | "start" | undefined,
  ];

  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[side] as ArrowSide;

  const isVertical = side === "top" || side === "bottom";

  const styles: Record<ArrowSide, string> = {
    top: "",
    left: "",
    right: "",
    bottom: "",
    [staticSide]: ARROW_STATIC_SIDE_OFFSET,
  };

  if (alignment) {
    if (isVertical) {
      if (alignment === "end") {
        styles.left = "auto";
        styles.right = `${ARROW_EDGE_INSET_PX}px`;
      } else {
        styles.right = "auto";
        styles.left = `${ARROW_EDGE_INSET_PX}px`;
      }
    } else if (alignment === "end") {
      styles.top = "auto";
      styles.bottom = `${ARROW_EDGE_INSET_PX}px`;
    } else {
      styles.bottom = "auto";
      styles.top = `${ARROW_EDGE_INSET_PX}px`;
    }
  } else if (isVertical) {
    styles.left = arrowX != null ? `${arrowX}px` : "";
  } else {
    styles.top = arrowY != null ? `${arrowY}px` : "";
  }

  return styles;
}

/** Floating UI placement alias re-exported from `@floating-ui/dom`. */
export type { Placement as PositionPlacement };
