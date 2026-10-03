// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Resizable } from "@/Components/Resizable";
import { ResizableHandle } from "@/Components/ResizableHandle";
import { ResizablePanel } from "@/Components/ResizablePanel";

const mounted: Array<ReturnType<typeof mount>> = [];

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    width: 400,
    right: 400,
    height: 200,
    bottom: 200,
    toJSON: () => ({}),
  });
});

afterEach(async () => {
  while (mounted.length > 0) {
    mounted.pop()?.unmount();
  }

  vi.restoreAllMocks();
  await flushPromises();
});

async function mountResizable(
  props: Record<string, unknown> = {},
  first: Record<string, unknown> = {},
) {
  const wrapper = mount(Resizable, {
    props,
    slots: {
      default: () => [
        h(ResizablePanel, first, () => "One"),
        h(ResizableHandle),
        h(ResizablePanel, {}, () => "Two"),
      ],
    },
  });

  mounted.push(wrapper);
  await flushPromises();

  return wrapper;
}

function panelFlex(wrapper: ReturnType<typeof mount>, name: string) {
  const panel = wrapper
    .findAll("[data-part='panel']")
    .find((node) => node.text() === name);

  return (panel?.element as HTMLElement).style.flex;
}

test("it should share the space evenly", async () => {
  const wrapper = await mountResizable();

  expect(panelFlex(wrapper, "One")).toBe("50 1 0px");
  expect(panelFlex(wrapper, "Two")).toBe("50 1 0px");
});

test("it should honor defaultSize", async () => {
  const wrapper = await mountResizable({}, { defaultSize: 25 });

  expect(panelFlex(wrapper, "One")).toBe("25 1 0px");
  expect(panelFlex(wrapper, "Two")).toBe("75 1 0px");
});

test("it should describe the handle as a separator", async () => {
  const wrapper = await mountResizable(
    {},
    { maxSize: 80, minSize: 10, id: "sidebar" },
  );

  const handle = wrapper.get("[role='separator']");

  expect(handle.attributes("tabindex")).toBe("0");
  expect(handle.attributes("aria-valuemin")).toBe("10");
  expect(handle.attributes("aria-valuemax")).toBe("80");
  expect(handle.attributes("aria-valuenow")).toBe("50");
  expect(handle.attributes("aria-controls")).toBe("sidebar");
  expect(handle.attributes("aria-label")).toBe("Resize panels");
  expect(handle.attributes("aria-orientation")).toBe("vertical");
});

test("it should resize with the arrow keys", async () => {
  const wrapper = await mountResizable({ keyboardStep: 5 });

  await wrapper.get("[role='separator']").trigger("keydown", {
    key: "ArrowRight",
  });

  expect(panelFlex(wrapper, "One")).toBe("55 1 0px");
  expect(wrapper.emitted("layoutChange")?.at(-1)).toEqual([[55, 45]]);
});

test("it should resize by dragging a handle", async () => {
  const wrapper = await mountResizable();
  const handle = wrapper.get("[role='separator']");

  await handle.trigger("pointerdown", { button: 0, clientX: 200 });

  expect(handle.attributes("data-dragging")).toBe("");

  window.dispatchEvent(new PointerEvent("pointermove", { clientX: 240 }));
  await flushPromises();

  expect(panelFlex(wrapper, "One")).toBe("60 1 0px");
  expect(panelFlex(wrapper, "Two")).toBe("40 1 0px");

  window.dispatchEvent(new PointerEvent("pointerup"));
  await flushPromises();

  expect(handle.attributes("data-dragging")).toBeUndefined();
});

test("it should stack panels when vertical", async () => {
  const wrapper = await mountResizable({ orientation: "vertical" });
  const handle = wrapper.get("[role='separator']");

  expect(wrapper.classes()).toContain("flex-col");
  expect(wrapper.attributes("data-orientation")).toBe("vertical");
  expect(handle.attributes("aria-orientation")).toBe("horizontal");

  await handle.trigger("keydown", { key: "ArrowDown" });

  expect(panelFlex(wrapper, "One")).toBe("60 1 0px");
});

test("it should lock every handle when disabled", async () => {
  const wrapper = await mountResizable({ disabled: true });
  const handle = wrapper.get("[role='separator']");

  await handle.trigger("keydown", { key: "ArrowRight" });

  expect(panelFlex(wrapper, "One")).toBe("50 1 0px");
  expect(handle.attributes("tabindex")).toBe("-1");
  expect(handle.attributes("aria-disabled")).toBe("true");
});
