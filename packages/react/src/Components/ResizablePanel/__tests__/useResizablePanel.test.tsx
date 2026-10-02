// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Resizable } from "@/Components/Resizable";
import { ResizablePanel, useResizablePanel } from "@/Components/ResizablePanel";

afterEach(() => {
  cleanup();
});

const libDefaults = {
  minSize: 0,
  maxSize: 100,
  collapsedSize: 0,
  collapsible: false,
} as const;

test("it should fill the group when it is the only panel", () => {
  function wrapper({ children }: { children: ReactNode }) {
    return <Resizable>{children}</Resizable>;
  }

  const { result } = renderHook(
    () => useResizablePanel({ defaultSize: 30 }, libDefaults),
    { wrapper },
  );

  expect(result.current.size).toBe(100);
  expect(result.current.collapsed).toBe(false);
  expect(result.current.rootBind["data-part"]).toBe("panel");
  expect(result.current.rootBind.style).toEqual({ flex: "100 1 0px" });
});

test("it should share the group with other panels", () => {
  function wrapper({ children }: { children: ReactNode }) {
    return (
      <Resizable>
        <ResizablePanel defaultSize={70}>Other</ResizablePanel>
        {children}
      </Resizable>
    );
  }

  const { result } = renderHook(
    () => useResizablePanel({ defaultSize: 30 }, libDefaults),
    { wrapper },
  );

  expect(result.current.size).toBe(30);
});

test("it should report a collapsed panel", () => {
  function wrapper({ children }: { children: ReactNode }) {
    return (
      <Resizable>
        <ResizablePanel>Other</ResizablePanel>
        {children}
      </Resizable>
    );
  }

  const { result } = renderHook(
    () =>
      useResizablePanel(
        { minSize: 20, collapsed: true, collapsible: true },
        libDefaults,
      ),
    { wrapper },
  );

  expect(result.current.size).toBe(0);
  expect(result.current.collapsed).toBe(true);
  expect(result.current.rootBind["data-collapsed"]).toBe("");
});
