// ** External Imports
import { Eye, EyeOff, Info } from "@lucide/svelte";
import { render } from "@testing-library/svelte";
import { expect, test } from "vitest";

// ** Local Imports
import { Icon } from "@/Components/Icon";

test("it should render an svg element", () => {
  const { container } = render(Icon, { props: { icon: Info } });

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should apply default md size classes", () => {
  const { container } = render(Icon, { props: { icon: Info } });

  const svg = container.querySelector("svg");

  expect(svg?.classList).toContain("w-4");
  expect(svg?.classList).toContain("h-4");
});

test("it should apply sm size classes", () => {
  const { container } = render(Icon, { props: { icon: Info, size: "sm" } });

  const svg = container.querySelector("svg");

  expect(svg?.classList).toContain("w-3.5");
  expect(svg?.classList).toContain("h-3.5");
});

test("it should merge custom class prop", () => {
  const { container } = render(Icon, {
    props: { icon: Info, class: "text-red-500" },
  });

  expect(container.querySelector("svg")?.classList).toContain("text-red-500");
});

test("it should forward additional attributes to the svg element", () => {
  const { container } = render(Icon, {
    props: {
      icon: Info,
      id: "info-icon",
      "aria-hidden": true,
      "data-testid": "icon",
    },
  });

  const svg = container.querySelector("#info-icon");

  expect(svg).not.toBeNull();
  expect(svg?.getAttribute("data-testid")).toBe("icon");
  expect(svg?.getAttribute("aria-hidden")).toBe("true");
});

test("it should swap the rendered icon when the icon prop changes", async () => {
  const { container, rerender } = render(Icon, { props: { icon: Eye } });

  expect(container.querySelector("svg")?.classList).toContain("lucide-eye");

  await rerender({ icon: EyeOff });

  expect(container.querySelector("svg")?.classList).toContain("lucide-eye-off");
  expect(container.querySelector("svg")?.classList).not.toContain("lucide-eye");
});

test("it should resolve a semantic icon name via the default adapter", () => {
  const { container } = render(Icon, { props: { icon: "info" } });

  expect(container.querySelector("svg")).not.toBeNull();
});
