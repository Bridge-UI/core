// ** External Imports
import { cleanup, fireEvent, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartSeries } from "@/Components/ChartSeries";
import { useChartTooltip } from "@/Components/ChartTooltip";

afterEach(() => {
  cleanup();
});

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <Chart categories={["Jan", "Feb"]}>
      <ChartSeries name="Revenue" data={[1500, 2]} />
      {children}
    </Chart>
  );
}

test("it should be closed without an active index", () => {
  const { result } = renderHook(() => useChartTooltip({}), {
    wrapper: Wrapper,
  });

  expect(result.current.isOpen).toBe(false);
  expect(result.current.context).toBeNull();
});

test("it should format values with the chart locale", () => {
  const { result } = renderHook(() => useChartTooltip({}), {
    wrapper: Wrapper,
  });

  expect(
    result.current.formatValue({
      id: "a",
      value: 1500,
      color: "red",
      name: "Revenue",
    }),
  ).toBe("1,500");
});

test("it should prefer formatValue from props", () => {
  const { result } = renderHook(
    () => useChartTooltip({ formatValue: (value) => `${value} USD` }),
    { wrapper: Wrapper },
  );

  expect(
    result.current.formatValue({
      id: "a",
      value: 2,
      color: "red",
      name: "Revenue",
    }),
  ).toBe("2 USD");
});

test("it should open when the plot reports an active index", () => {
  const { result } = renderHook(() => useChartTooltip({}), {
    wrapper: Wrapper,
  });

  fireEvent.keyDown(document.querySelector("[role='img']") as Element, {
    key: "ArrowRight",
  });

  expect(result.current.isOpen).toBe(true);
  expect(result.current.context?.category).toBe("Jan");
  expect(result.current.rootBind["aria-hidden"]).toBe(true);
});
