// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useCalendarDate,
  type CalendarDateOwnProps,
} from "@/Components/CalendarDate";
import BridgeUIProvider from "@/Provider/BridgeUIProvider.vue";

const libDefaults = {
  rounded: "md",
  startOfWeek: 0,
  color: "primary",
} satisfies Partial<CalendarDateOwnProps>;

function mountUseCalendarDate(
  props: Partial<CalendarDateOwnProps> = {},
  options: { registryTokens?: { rounded?: Record<string, string> } } = {},
) {
  let result!: ReturnType<typeof useCalendarDate>;

  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useCalendarDate(
        { viewDate: new Date(2021, 4, 1), ...props },
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
        Calendar: {
          tokens: options.registryTokens,
        },
      },
    },
  });

  return result;
}

test("it should build a 42-day grid", () => {
  const { days } = mountUseCalendarDate();

  expect(days.value).toHaveLength(42);
});

test("it should default color to primary", () => {
  const { merged } = mountUseCalendarDate();

  expect(merged.value.color).toBe("primary");
});

test("it should rotate weekdays for startOfWeek", () => {
  const { weekdays } = mountUseCalendarDate({ startOfWeek: 1 });

  expect(weekdays.value[0]?.toLowerCase().startsWith("m")).toBe(true);
});

test("it should mark selected day cells", () => {
  const { days } = mountUseCalendarDate({
    value: new Date(2021, 4, 21),
  });

  const selected = days.value.filter((day) => day.selected);

  expect(selected).toHaveLength(1);
  expect(selected[0]?.label).toBe("21");
});

test("it should apply registry tokens.rounded overrides", () => {
  const { days, getDayBind } = mountUseCalendarDate(
    { rounded: "md" },
    { registryTokens: { rounded: { md: "rounded-none" } } },
  );

  const day = days.value.find((cell) => !cell.outside);

  expect(day).toBeTruthy();
  expect(getDayBind(day!).class).toContain("rounded-none");
});
