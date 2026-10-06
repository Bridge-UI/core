// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { h, type Slots } from "vue";

// ** Local Imports
import { Resizable } from "@/Components/Resizable";
import { ResizableHandle } from "@/Components/ResizableHandle";
import { ResizablePanel } from "@/Components/ResizablePanel";

const mounted: Array<ReturnType<typeof mount>> = [];

afterEach(async () => {
  while (mounted.length > 0) {
    mounted.pop()?.unmount();
  }

  await flushPromises();
});

async function mountGroup(
  handle: Record<string, unknown> = {},
  first: Record<string, unknown> = {},
  handleSlots?: Slots,
) {
  const wrapper = mount(Resizable, {
    slots: {
      default: () => [
        h(ResizablePanel, first, () => "One"),
        h(ResizableHandle, handle, handleSlots),
        h(ResizablePanel, {}, () => "Two"),
      ],
    },
  });

  mounted.push(wrapper);
  await flushPromises();

  return wrapper;
}

test("it should render a grip by default", async () => {
  const wrapper = await mountGroup({
    classes: { grip: "bg-primary-500" },
  });

  const grip = wrapper.get("[data-part='grip']");

  expect(grip.classes()).toContain("bg-primary-500");
  expect(grip.attributes("aria-hidden")).toBe("true");
});

test("it should render the grip slot", async () => {
  const wrapper = await mountGroup({}, {}, {
    grip: () => "⋮",
  } as unknown as Slots);

  expect(wrapper.get("[data-part='grip']").text()).toBe("⋮");
});

test("it should hide the grip with hideGrip", async () => {
  const wrapper = await mountGroup({ hideGrip: true });

  expect(wrapper.find("[data-part='grip']").exists()).toBe(false);
});

test("it should toggle a collapsible panel with Enter", async () => {
  const wrapper = await mountGroup(
    {},
    { minSize: 20, defaultSize: 40, collapsible: true },
  );

  const handle = wrapper.get("[role='separator']");

  await handle.trigger("keydown", { key: "Enter" });

  expect(handle.attributes("aria-valuenow")).toBe("0");

  await handle.trigger("keydown", { key: "Enter" });

  expect(handle.attributes("aria-valuenow")).toBe("40");
});

test("it should ignore keys on a disabled handle", async () => {
  const wrapper = await mountGroup({ disabled: true });
  const handle = wrapper.get("[role='separator']");

  await handle.trigger("keydown", { key: "ArrowRight" });

  expect(handle.attributes("data-disabled")).toBe("");
  expect(handle.attributes("aria-valuenow")).toBe("50");
});

test("it should keep a custom aria-label", async () => {
  const wrapper = await mountGroup({ "aria-label": "Resize sidebar" });

  expect(wrapper.get("[role='separator']").attributes("aria-label")).toBe(
    "Resize sidebar",
  );
});
