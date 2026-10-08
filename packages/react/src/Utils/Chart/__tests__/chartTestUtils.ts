// ** External Imports
import { act, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";

type PlotSize = { height: number; width: number };

/**
 * happy-dom has no layout: stubs the plot size and returns a function that
 * resizes it and drives `ResizeObserver` by hand.
 */
export function stubPlotSize(initial: PlotSize) {
  let size = initial;
  const callbacks = new Set<ResizeObserverCallback>();

  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(
    () => size.width,
  );
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(
    () => size.height,
  );

  vi.stubGlobal(
    "ResizeObserver",
    class {
      callback: ResizeObserverCallback;

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }

      observe() {
        callbacks.add(this.callback);
      }

      unobserve() {}

      disconnect() {
        callbacks.delete(this.callback);
      }
    },
  );

  return (next: PlotSize) => {
    size = next;

    act(() => {
      callbacks.forEach((callback) => {
        callback([], {} as ResizeObserver);
      });
    });
  };
}

/**
 * Element ECharts renders into (inside the plot's `aria-hidden` host).
 */
export function getEchartsHost() {
  const host = screen
    .getByRole("img")
    .querySelector<HTMLElement>('[aria-hidden="true"] > div');

  if (host === null) {
    throw new Error("ECharts host not found");
  }

  return host;
}

/**
 * Moves the keyboard pointer to item `index` (from idle).
 */
export function activateChartItem(index: number) {
  const plot = screen.getByRole("img");

  for (let step = 0; step <= index; step += 1) {
    fireEvent.keyDown(plot, { key: "ArrowRight" });
  }
}
