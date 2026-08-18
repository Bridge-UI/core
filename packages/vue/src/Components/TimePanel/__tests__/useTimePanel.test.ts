// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useTimePanel, type TimePanelOwnProps } from "@/Components/TimePanel";
import BridgeUIProvider from "@/Provider/BridgeUIProvider.vue";

const libDefaults = {
  ampm: false,
  interval: 1,
  rounded: "md",
  color: "primary",
  showSeconds: false,
} satisfies Partial<TimePanelOwnProps>;

function mountUseTimePanel(
  props: Partial<TimePanelOwnProps> = {},
  options: { registryTokens?: { rounded?: Record<string, string> } } = {},
) {
  let result!: ReturnType<typeof useTimePanel>;

  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useTimePanel(
        { value: new Date(2021, 4, 21, 14, 30), ...props },
        libDefaults,
        emit,
      );

      return () => h("div");
    },
  });

  if (!("registryTokens" in options)) {
    mount(Wrapper);

    return result;
  }

  mount(BridgeUIProvider, {
    slots: {
      default: () => h(Wrapper),
    },
    props: {
      components: {
        TimePanel: {
          tokens: options.registryTokens,
        },
      },
    },
  });

  return result;
}

test("it should expose hour items", () => {
  const { hourItems } = mountUseTimePanel();

  expect(hourItems.value).toHaveLength(24);
});

test("it should keep a compact width with flexible columns by default", () => {
  const { rootBind, columnBind } = mountUseTimePanel();

  expect(rootBind.value.class).toContain("w-fit");
  expect(rootBind.value.class).not.toContain("w-full");
  expect(columnBind.value.class).toContain("flex-1");
  expect(columnBind.value.class).toContain("min-w-[3.75rem]");
});

test("it should fill available width when fill is set", () => {
  const { rootBind } = mountUseTimePanel({ fill: true });

  expect(rootBind.value.class).toContain("w-full");
});

test("it should mark the selected hour", () => {
  const { hourItems } = mountUseTimePanel();

  expect(hourItems.value[14]?.selected).toBe(true);
});

test("it should expose meridiem items when ampm is set", () => {
  const { showMeridiem, meridiemItems } = mountUseTimePanel({ ampm: true });

  expect(showMeridiem.value).toBe(true);
  expect(meridiemItems.value).toHaveLength(2);
});

test("it should apply registry tokens.rounded overrides", () => {
  const { hourItems, getHourBind } = mountUseTimePanel(
    { rounded: "md" },
    { registryTokens: { rounded: { md: "rounded-none" } } },
  );

  expect(getHourBind(hourItems.value[0]!).class).toContain("rounded-none");
});
