// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useCalendarRange,
  type CalendarRangeOwnProps,
} from "@/Components/CalendarRange";

const libDefaults = {
  rounded: "md",
  startOfWeek: 0,
  color: "primary",
  orientation: "horizontal",
} as const satisfies Partial<CalendarRangeOwnProps>;

function mountUseCalendarRange(props: Partial<CalendarRangeOwnProps> = {}) {
  let result!: ReturnType<typeof useCalendarRange>;

  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useCalendarRange(
        {
          viewDate: new Date(2021, 4, 1),
          ...props,
        },
        libDefaults,
        emit,
      );

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should default end view one month after start", () => {
  const { viewDate, endViewDate } = mountUseCalendarRange();

  expect(viewDate.value.getMonth()).toBe(4);
  expect(endViewDate.value.getMonth()).toBe(5);
});

test("it should expose end month selector bind", () => {
  const { endMonthLabel, endMonthSelectorBind } = mountUseCalendarRange();

  expect(endMonthLabel.value).toBe("June");
  expect(endMonthSelectorBind.value["aria-label"]).toBe("Select end month");
});

test("it should default to horizontal orientation", () => {
  const { merged, rootBind, startBind, isVertical, monthsBind, panelsBind } =
    mountUseCalendarRange();

  expect(merged.value.orientation).toBe("horizontal");
  expect(isVertical.value).toBe(false);
  expect(rootBind.value.class).not.toContain("w-full");
  expect(rootBind.value.class).toContain("min-w-[38rem]");
  expect(panelsBind.value.class).toContain("w-full");
  expect(panelsBind.value.class).toContain("flex-row");
  expect(startBind.value.class).toContain("flex-1");
  expect(startBind.value.class).toContain("min-w-72");
  expect(startBind.value.class).not.toContain("min-w-0");
  expect(monthsBind.value.class).toContain("flex-1");
  expect(monthsBind.value.class).toContain("justify-between");
});

test("it should fill available width when fill is set", () => {
  const { rootBind } = mountUseCalendarRange({ fill: true });

  expect(rootBind.value.class).toContain("w-full");
  expect(rootBind.value.class).toContain("min-w-[38rem]");
});

test("it should stack panels when orientation is vertical", () => {
  const { endBind, rootBind, startBind, isVertical, monthsBind, panelsBind } =
    mountUseCalendarRange({
      orientation: "vertical",
    });

  expect(isVertical.value).toBe(true);
  expect(rootBind.value.class).toContain("w-72");
  expect(rootBind.value.class).toContain("min-w-72");
  expect(panelsBind.value.class).toContain("flex-col");
  expect(startBind.value.class).toContain("flex-1");
  expect(startBind.value.class).toContain("min-w-72");
  expect(endBind.value.class).toContain("flex-1");
  expect(monthsBind.value.class).toContain("justify-start");
  expect(monthsBind.value.class).not.toContain("justify-between");
});
