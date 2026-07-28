// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useTabList } from "@/Components/TabList/hooks/useTabList";
import { Tabs } from "@/Components/Tabs";

afterEach(() => {
  cleanup();
});

test("it should build a tablist bind inside Tabs", () => {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Tabs defaultValue="a">{children}</Tabs>;
  }

  const { result } = renderHook(() => useTabList({}), { wrapper: Wrapper });

  expect(result.current.rootBind.role).toBe("tablist");
});
