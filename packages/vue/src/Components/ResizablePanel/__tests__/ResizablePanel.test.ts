// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

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

async function mountGroup(first: Record<string, unknown>) {
  const wrapper = mount(Resizable, {
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

function panelOf(wrapper: ReturnType<typeof mount>, name: string) {
  const panel = wrapper
    .findAll("[data-part='panel']")
    .find((node) => node.text() === name);

  return panel?.element as HTMLElement;
}

test("it should start collapsed when collapsed is true", async () => {
  const wrapper = await mountGroup({
    minSize: 20,
    collapsed: true,
    collapsible: true,
  });

  expect(panelOf(wrapper, "One").style.flex).toBe("0 1 0px");
  expect(panelOf(wrapper, "One").hasAttribute("data-collapsed")).toBe(true);
  expect(panelOf(wrapper, "Two").style.flex).toBe("100 1 0px");
});

test("it should follow v-model:collapsed", async () => {
  const collapsed = ref(false);
  const updates: boolean[] = [];

  const wrapper = mount(
    defineComponent({
      setup() {
        return () =>
          h(Resizable, null, () => [
            h(
              ResizablePanel,
              {
                minSize: 20,
                defaultSize: 30,
                collapsible: true,
                collapsed: collapsed.value,
                "onUpdate:collapsed": (value: boolean) => {
                  updates.push(value);
                  collapsed.value = value;
                },
              },
              () => "One",
            ),
            h(ResizableHandle),
            h(ResizablePanel, null, () => "Two"),
          ]);
      },
    }),
  );

  mounted.push(wrapper);
  await flushPromises();

  expect(panelOf(wrapper, "One").style.flex).toBe("30 1 0px");

  collapsed.value = true;
  await flushPromises();

  expect(panelOf(wrapper, "One").style.flex).toBe("0 1 0px");

  collapsed.value = false;
  await flushPromises();

  expect(panelOf(wrapper, "One").style.flex).toBe("30 1 0px");
  expect(updates).toEqual([]);

  await wrapper.get("[role='separator']").trigger("keydown", { key: "Home" });

  expect(updates).toEqual([true]);
  expect(collapsed.value).toBe(true);
});

test("it should emit resize when its size changes", async () => {
  const wrapper = await mountGroup({});
  const panel = wrapper.findAllComponents(ResizablePanel)[0];

  expect(panel?.emitted("resize")).toBeUndefined();

  await wrapper.get("[role='separator']").trigger("keydown", {
    key: "ArrowLeft",
  });

  expect(panel?.emitted("resize")?.at(-1)).toEqual([40]);
});

test("it should keep minSize and maxSize", async () => {
  const wrapper = await mountGroup({ maxSize: 55, minSize: 45 });
  const handle = wrapper.get("[role='separator']");

  await handle.trigger("keydown", { key: "Home" });

  expect(panelOf(wrapper, "One").style.flex).toBe("45 1 0px");

  await handle.trigger("keydown", { key: "End" });

  expect(panelOf(wrapper, "One").style.flex).toBe("55 1 0px");
});
