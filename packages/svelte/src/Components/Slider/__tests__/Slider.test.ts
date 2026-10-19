// ** External Imports
import { fireEvent, render } from "@testing-library/svelte";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { Slider } from "@/Components/Slider";

afterEach(() => {
  resetLayerStackForTests();
});

test("it should render a slider thumb with role slider", () => {
  const { container } = render(Slider, { props: { label: "Volume" } });

  expect(container.querySelector('[role="slider"]')).not.toBeNull();
});

test("it should render label corner and description chrome", () => {
  const { container } = render(Slider, {
    props: {
      corner: "%",
      label: "Opacity",
      description: "Adjust transparency",
    },
  });

  expect(container.textContent).toContain("%");
  expect(container.textContent).toContain("Opacity");
  expect(container.textContent).toContain("Adjust transparency");
});

test("it should render two thumbs when range is enabled", () => {
  const { container } = render(Slider, {
    props: { range: true, defaultValue: [20, 80] },
  });

  expect(container.querySelectorAll('[role="slider"]')).toHaveLength(2);
});

test("it should call onChange when using keyboard arrows", async () => {
  const onChange = vi.fn();
  const { container } = render(Slider, {
    props: { onChange, value: 40, label: "Volume" },
  });

  await fireEvent.keyDown(container.querySelector('[role="slider"]')!, {
    key: "ArrowRight",
  });

  expect(onChange).toHaveBeenCalledWith(41);
  expect(
    container.querySelector('[role="slider"]')?.getAttribute("aria-valuenow"),
  ).toBe("41");
});

test("it should respect min max and step on keyboard", async () => {
  const onChange = vi.fn();
  const { container } = render(Slider, {
    props: { onChange, min: 0, max: 100, step: 10, value: 20 },
  });

  await fireEvent.keyDown(container.querySelector('[role="slider"]')!, {
    key: "ArrowRight",
  });

  expect(onChange).toHaveBeenCalledWith(30);
});

test("it should update uncontrolled value from defaultValue", async () => {
  const { container } = render(Slider, { props: { defaultValue: 10 } });
  const thumb = container.querySelector('[role="slider"]')!;

  await fireEvent.keyDown(thumb, { key: "End" });

  expect(thumb.getAttribute("aria-valuenow")).toBe("100");
});

test("it should label the thumb from a string label only", () => {
  const { container } = render(Slider, { props: { label: "Volume" } });

  expect(
    container.querySelector('[role="slider"]')?.getAttribute("aria-label"),
  ).toBe("Volume");
});

test("it should show tooltip on focus by default", async () => {
  const { container } = render(Slider, {
    props: { label: "Volume", defaultValue: 50 },
  });

  await fireEvent.focus(container.querySelector('[role="slider"]')!);

  expect(
    document.body.querySelector('[role="tooltip"]')?.textContent,
  ).toContain("50");
});

test("it should hide tooltip when showTooltip is false", async () => {
  const { container } = render(Slider, {
    props: { label: "Volume", defaultValue: 50, showTooltip: false },
  });

  await fireEvent.focus(container.querySelector('[role="slider"]')!);

  expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
});

test("it should render stop labels", () => {
  const { container } = render(Slider, {
    props: {
      showStops: true,
      stops: [
        { value: 0, label: "Low" },
        { value: 100, label: "High" },
      ],
    },
  });

  expect(container.textContent).toContain("Low");
  expect(container.textContent).toContain("High");
});

test("it should show error message when invalid", () => {
  const { container } = render(Slider, {
    props: { error: true, errorMessage: "Pick a value" },
  });

  expect(container.textContent).toContain("Pick a value");
  expect(
    container.querySelector('[role="slider"]')?.getAttribute("aria-invalid"),
  ).toBe("true");
});

test("it should not leak snippets or the value as root attributes", () => {
  const { container } = render(Slider, { props: { value: 10 } });

  const root = container.firstElementChild;

  expect(root?.hasAttribute("value")).toBe(false);
  expect(root?.hasAttribute("onChange")).toBe(false);
});
