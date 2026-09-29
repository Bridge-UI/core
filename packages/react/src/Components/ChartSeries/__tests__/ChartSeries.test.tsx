// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Button } from "@/Components/Button";
import { Chart } from "@/Components/Chart";
import { ChartSeries } from "@/Components/ChartSeries";

const categories = ["Jan", "Feb", "Mar"];

afterEach(() => {
  cleanup();
});

test("it should render nothing on its own and register with the chart", () => {
  const { container } = render(
    <Chart categories={categories}>
      <ChartSeries name="Revenue" data={[1, 2, 3]} />
    </Chart>,
  );

  expect(container.querySelector("[data-chart-series]")).toBeNull();
  expect(screen.getByRole("columnheader", { name: "Revenue" })).toBeTruthy();
});

test("it should list every series in the data table", () => {
  render(
    <Chart categories={categories}>
      <ChartSeries name="A" type="area" data={[1, 2, 3]} />
      <ChartSeries name="B" type="bar" data={[1, 2, 3]} />
    </Chart>,
  );

  expect(screen.getByRole("columnheader", { name: "A" })).toBeTruthy();
  expect(screen.getByRole("columnheader", { name: "B" })).toBeTruthy();
});

test("it should unregister when unmounted", () => {
  function Toggle() {
    const [visible, setVisible] = useState(true);

    return (
      <>
        <Button onClick={() => setVisible(false)}>Remove</Button>
        <Chart categories={categories}>
          <ChartSeries name="A" data={[1, 2, 3]} />
          {visible ? <ChartSeries name="B" data={[3, 2, 1]} /> : null}
        </Chart>
      </>
    );
  }

  render(<Toggle />);

  expect(screen.getByRole("columnheader", { name: "A" })).toBeTruthy();
  expect(screen.getByRole("columnheader", { name: "B" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Remove" }));

  expect(screen.queryByRole("columnheader", { name: "B" })).toBeNull();
});
