// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Spinner } from "@/Components/Spinner";

test("it should render with role progressbar", () => {
  const wrapper = mount(Spinner, {
    attrs: { "aria-label": "Loading…" },
  });

  expect(wrapper.find('[role="progressbar"]').exists()).toBe(true);
});

test("it should omit aria-valuenow for indeterminate by default", () => {
  const wrapper = mount(Spinner, {
    attrs: { "aria-label": "Loading…" },
  });

  expect(
    wrapper.find('[role="progressbar"]').attributes("aria-valuenow"),
  ).toBeUndefined();
});

test("it should set aria-valuenow for determinate variant", () => {
  const wrapper = mount(Spinner, {
    attrs: { "aria-label": "Export" },
    props: { value: 40, variant: "determinate" },
  });

  const root = wrapper.find('[role="progressbar"]');

  expect(root.attributes("aria-valuenow")).toBe("40");
  expect(root.attributes("aria-valuemin")).toBe("0");
  expect(root.attributes("aria-valuemax")).toBe("100");
});

test("it should apply rotate animation on root for indeterminate", () => {
  const wrapper = mount(Spinner, {
    attrs: { "aria-label": "Loading…" },
  });

  expect(wrapper.find('[role="progressbar"]').classes()).toContain(
    "animate-bridge-spinner-rotate",
  );
});

test("it should apply dash animation on circle by default", () => {
  const wrapper = mount(Spinner, {
    attrs: { "aria-label": "Loading…" },
  });

  expect(wrapper.find("circle").classes()).toContain(
    "animate-bridge-spinner-dash",
  );
});

test("it should omit dash animation when disableShrink is true", () => {
  const wrapper = mount(Spinner, {
    props: { disableShrink: true },
    attrs: { "aria-label": "Loading…" },
  });

  expect(wrapper.find("circle").classes()).not.toContain(
    "animate-bridge-spinner-dash",
  );
});

test("it should render track circle when enableTrack is true", () => {
  const wrapper = mount(Spinner, {
    props: { enableTrack: true },
    attrs: { "aria-label": "Loading…" },
  });

  expect(wrapper.findAll("circle")).toHaveLength(2);
});

test("it should apply primary circle stroke by default", () => {
  const wrapper = mount(Spinner, {
    attrs: { "aria-label": "Loading…" },
  });

  expect(wrapper.find("circle").classes()).toContain("stroke-primary-500");
});

test("it should apply size class", () => {
  const wrapper = mount(Spinner, {
    props: { size: "lg" },
    attrs: { "aria-label": "Loading…" },
  });

  expect(wrapper.find('[role="progressbar"]').classes()).toContain("size-14");
});

test("it should clamp value above 100", () => {
  const wrapper = mount(Spinner, {
    attrs: { "aria-label": "Export" },
    props: { value: 150, variant: "determinate" },
  });

  expect(wrapper.find('[role="progressbar"]').attributes("aria-valuenow")).toBe(
    "100",
  );
});

test("it should forward aria-label to the root", () => {
  const wrapper = mount(Spinner, {
    attrs: { "aria-label": "Uploading photos" },
  });

  expect(wrapper.find('[role="progressbar"]').attributes("aria-label")).toBe(
    "Uploading photos",
  );
});

test("it should render an svg element", () => {
  const wrapper = mount(Spinner, {
    attrs: { "aria-label": "Loading…" },
  });

  expect(wrapper.find("svg").exists()).toBe(true);
});
