// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Progress } from "@/Components/Progress";

test("it should render with role progressbar", () => {
  const wrapper = mount(Progress, {
    attrs: { "aria-label": "Loading…" },
  });

  expect(wrapper.find('[role="progressbar"]').exists()).toBe(true);
});

test("it should omit aria-valuenow for indeterminate by default", () => {
  const wrapper = mount(Progress, {
    attrs: { "aria-label": "Loading…" },
  });

  expect(
    wrapper.find('[role="progressbar"]').attributes("aria-valuenow"),
  ).toBeUndefined();
});

test("it should set aria-valuenow for determinate variant", () => {
  const wrapper = mount(Progress, {
    attrs: { "aria-label": "Export" },
    props: { value: 40, variant: "determinate" },
  });

  const root = wrapper.find('[role="progressbar"]');

  expect(root.attributes("aria-valuemin")).toBe("0");
  expect(root.attributes("aria-valuenow")).toBe("40");
  expect(root.attributes("aria-valuemax")).toBe("100");
});

test("it should apply determinate bar width from value", () => {
  const wrapper = mount(Progress, {
    attrs: { "aria-label": "Export" },
    props: { value: 75, variant: "determinate" },
  });

  const bar = wrapper.find('[role="progressbar"] > div:last-child');

  expect(bar.attributes("style")).toContain("width: 75%");
});

test("it should render buffer bar with valueBuffer width", () => {
  const wrapper = mount(Progress, {
    attrs: { "aria-label": "Loading…" },
    props: { value: 30, valueBuffer: 60, variant: "buffer" },
  });

  const children = wrapper.findAll('[role="progressbar"] > div');

  expect(children).toHaveLength(3);
  expect(children[1]?.attributes("style")).toContain("width: 60%");
  expect(children[2]?.attributes("style")).toContain("width: 30%");
});

test("it should apply query animation class", () => {
  const wrapper = mount(Progress, {
    props: { variant: "query" },
    attrs: { "aria-label": "Loading…" },
  });

  const bar = wrapper.find('[role="progressbar"] > div:last-child');

  expect(bar.classes()).toContain("animate-bridge-progress-query");
});

test("it should apply indeterminate animation class by default", () => {
  const wrapper = mount(Progress, {
    attrs: { "aria-label": "Loading…" },
  });

  const bar = wrapper.find('[role="progressbar"] > div:last-child');

  expect(bar.classes()).toContain("animate-bridge-progress-indeterminate");
});

test("it should apply primary bar color by default", () => {
  const wrapper = mount(Progress, {
    attrs: { "aria-label": "Loading…" },
  });

  const bar = wrapper.find('[role="progressbar"] > div:last-child');

  expect(bar.classes()).toContain("bg-primary-500");
});

test("it should apply size height class", () => {
  const wrapper = mount(Progress, {
    props: { size: "lg" },
    attrs: { "aria-label": "Loading…" },
  });

  expect(wrapper.find('[role="progressbar"]').classes()).toContain("h-2");
});

test("it should apply rounded-full by default", () => {
  const wrapper = mount(Progress, {
    attrs: { "aria-label": "Loading…" },
  });

  expect(wrapper.find('[role="progressbar"]').classes()).toContain(
    "rounded-full",
  );
});

test("it should clamp value above 100", () => {
  const wrapper = mount(Progress, {
    attrs: { "aria-label": "Export" },
    props: { value: 150, variant: "determinate" },
  });

  const root = wrapper.find('[role="progressbar"]');
  const bar = wrapper.find('[role="progressbar"] > div:last-child');

  expect(root.attributes("aria-valuenow")).toBe("100");
  expect(bar.attributes("style")).toContain("width: 100%");
});

test("it should forward aria-label to the root", () => {
  const wrapper = mount(Progress, {
    attrs: { "aria-label": "Uploading photos" },
  });

  expect(wrapper.find('[role="progressbar"]').attributes("aria-label")).toBe(
    "Uploading photos",
  );
});
