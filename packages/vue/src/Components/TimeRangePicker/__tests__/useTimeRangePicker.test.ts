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
  showSeconds: false,
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

test("it should size the root to content and let panels grow", () => {
  const {
    endBind,
    rootBind,
    startBind,
    panelsBind,
    titlesBind,
    endTitleBind,
    titleGapBind,
    startTitleBind,
  } = mountUseTimeRangePicker();

  expect(titlesBind.value).toContain("px-2.5");
  expect(titleGapBind.value).toContain("w-px");
  expect(endTitleBind.value).toContain("pl-2.5");
  expect(endBind.value.class).toContain("flex-1");
  expect(endBind.value.class).toContain("pl-2.5");
  expect(rootBind.value.class).toContain("w-fit");
  expect(startTitleBind.value).toContain("pr-2.5");
  expect(startBind.value.class).toContain("flex-1");
  expect(startBind.value.class).toContain("pr-2.5");
  expect(panelsBind.value.class).toContain("px-2.5");
  expect(panelsBind.value.class).toContain("w-full");
  expect(panelsBind.value.class).toContain("flex-row");
  expect(rootBind.value.class).not.toContain("px-2.5");
});
