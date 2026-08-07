// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useTimeRangePicker,
  type TimeRangePickerOwnProps,
} from "@/Components/TimeRangePicker";

const libDefaults = {
  ampm: false,
  interval: 1,
  rounded: "md",
  color: "primary",
  showFooter: false,
  orientation: "horizontal",
} as const satisfies Partial<TimeRangePickerOwnProps>;

function mountUseTimeRangePicker(props: Partial<TimeRangePickerOwnProps> = {}) {
  let result!: ReturnType<typeof useTimeRangePicker>;

  const emit = vi.fn() as unknown as {
    (event: "change", value: unknown): void;
    (event: "cancel"): void;
  };

  const Wrapper = defineComponent({
    props: {} as Record<string, never>,
    setup() {
      result = useTimeRangePicker(
        props,
        libDefaults as Parameters<typeof useTimeRangePicker>[1],
        emit,
      );

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should default showFooter to false", () => {
  const { showFooter } = mountUseTimeRangePicker();

  expect(showFooter.value).toBe(false);
});

test("it should enable footer when showFooter is set", () => {
  const { showFooter } = mountUseTimeRangePicker({ showFooter: true });

  expect(showFooter.value).toBe(true);
});

test("it should size the root and panels to their content", () => {
  const { endBind, rootBind, startBind, panelsBind } =
    mountUseTimeRangePicker();

  expect(endBind.value.class).toContain("w-fit");
  expect(rootBind.value.class).toContain("w-fit");
  expect(startBind.value.class).toContain("w-fit");
  expect(endBind.value.class).not.toContain("flex-1");
  expect(startBind.value.class).not.toContain("flex-1");
  expect(panelsBind.value.class).toContain("flex-row");
});

test("it should stack panels when orientation is vertical", () => {
  const { endBind, startBind, panelsBind } = mountUseTimeRangePicker({
    orientation: "vertical",
  });

  expect(panelsBind.value.class).toContain("flex-col");
  expect(startBind.value.class).toContain("w-full");
  expect(endBind.value.class).toContain("w-full");
});
