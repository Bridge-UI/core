// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useTimePanel, type TimePanelOwnProps } from "@/Components/TimePanel";

const libDefaults = {
  ampm: false,
  interval: 1,
  rounded: "md",
  color: "primary",
} satisfies Partial<TimePanelOwnProps>;

function mountUseTimePanel(props: Partial<TimePanelOwnProps> = {}) {
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

  mount(Wrapper);

  return result;
}

test("it should expose hour items", () => {
  const { hourItems } = mountUseTimePanel();

  expect(hourItems.value).toHaveLength(24);
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
