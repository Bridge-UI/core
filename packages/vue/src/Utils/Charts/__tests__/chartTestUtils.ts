// ** External Imports
import { flushPromises, type VueWrapper } from "@vue/test-utils";
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

  return async (next: PlotSize) => {
    size = next;

    callbacks.forEach((callback) => {
      callback([], {} as ResizeObserver);
    });

    await flushPromises();
  };
}

/**
 * Element ECharts renders into (inside the plot's `aria-hidden` host).
 */
export function getEchartsHost(wrapper: VueWrapper) {
  return wrapper.get<HTMLElement>("[role='img'] [aria-hidden='true'] > div")
    .element;
}

/**
 * Presses `key` on the plot and waits for the update.
 */
export async function pressChartKey(wrapper: VueWrapper, key: string) {
  await wrapper.find("[role='img']").trigger("keydown", { key });
  await flushPromises();
}
