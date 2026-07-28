// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useTabPanel } from "@/Components/TabPanel/hooks/useTabPanel";
import { Tabs } from "@/Components/Tabs";

afterEach(() => {
  cleanup();
});

test("it should expose selected state for the matching value", () => {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Tabs defaultValue="a">{children}</Tabs>;
  }

  const { result } = renderHook(
    () => useTabPanel({ value: "a", children: "A" }),
    { wrapper: Wrapper },
  );

  expect(result.current.selected).toBe(true);
  expect(result.current.rootBind.role).toBe("tabpanel");
});
