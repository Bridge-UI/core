// @vitest-environment happy-dom

// ** External Imports
import { afterEach, describe, expect, test, vi } from "vitest";

// ** Local Imports
import { hasDocument, hasWindow, requestAfterNextPaint } from "@/Runtime/env";

afterEach(() => {
  vi.restoreAllMocks();
});

function stubAnimationFrames() {
  const queue = new Map<number, FrameRequestCallback>();
  let nextId = 0;

  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    nextId += 1;
    queue.set(nextId, callback);

    return nextId;
  });

  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
    queue.delete(id);
  });

  return () => {
    const pending = [...queue.values()];

    queue.clear();
    pending.forEach((callback) => {
      callback(0);
    });
  };
}

describe("hasWindow", () => {
  test("it should return true in jsdom", () => {
    expect(hasWindow()).toBe(true);
  });
});

describe("hasDocument", () => {
  test("it should return true in jsdom", () => {
    expect(hasDocument()).toBe(true);
  });
});

describe("requestAfterNextPaint", () => {
  test("it should run the callback on the second animation frame", () => {
    const flushFrame = stubAnimationFrames();
    const callback = vi.fn();

    requestAfterNextPaint(callback);

    flushFrame();
    expect(callback).not.toHaveBeenCalled();

    flushFrame();
    expect(callback).toHaveBeenCalledOnce();
  });

  test("it should cancel before the first frame", () => {
    const flushFrame = stubAnimationFrames();
    const callback = vi.fn();

    const cancel = requestAfterNextPaint(callback);

    cancel();
    flushFrame();
    flushFrame();

    expect(callback).not.toHaveBeenCalled();
  });

  test("it should cancel between the two frames", () => {
    const flushFrame = stubAnimationFrames();
    const callback = vi.fn();

    const cancel = requestAfterNextPaint(callback);

    flushFrame();
    cancel();
    flushFrame();

    expect(callback).not.toHaveBeenCalled();
  });
});
