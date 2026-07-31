// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useTab } from "@/Components/Tab/hooks/useTab";
import { Tabs } from "@/Components/Tabs";

afterEach(() => {
  cleanup();
});

test("it should mark the selected tab", () => {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Tabs defaultValue="a">{children}</Tabs>;
  }

  const { result } = renderHook(() => useTab({ value: "a", children: "A" }), {
    wrapper: Wrapper,
  });

  expect(result.current.rootBind.role).toBe("tab");
  expect(result.current.rootBind["aria-selected"]).toBe(true);
});
