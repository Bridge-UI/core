// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { ChartScatter } from "@/Components/ChartScatter";
import { useChartScatterSeries } from "@/Components/ChartScatterSeries";

afterEach(() => {
  cleanup();
});

function Wrapper({ children }: { children: ReactNode }) {
  return <ChartScatter>{children}</ChartScatter>;
}

test("it should build a scatter entry", () => {
  const { result } = renderHook(
    () =>
      useChartScatterSeries({
        name: "A",
        symbolSize: 12,
        data: [[1, 2, 3]],
        sizeName: "Orders",
      }),
    { wrapper: Wrapper },
  );

  expect(result.current.entry).toMatchObject({
    name: "A",
    symbolSize: 12,
    kind: "scatter",
    data: [[1, 2, 3]],
    sizeName: "Orders",
  });
});
