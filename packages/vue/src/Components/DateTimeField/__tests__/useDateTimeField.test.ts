// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import { createNativeDateAdapter } from "@bridge-ui/core/Adapters";
import type { BridgeUIGlobal } from "@bridge-ui/core/Config";

// ** Local Imports
import {
  useDateTimeField,
  type DateTimeFieldOwnProps,
} from "@/Components/DateTimeField";
import { createBridgeUI } from "@/Provider/createBridgeUI";

const SAO_PAULO = "America/Sao_Paulo";

function wallClock(timeZone: string) {
  const adapter = createNativeDateAdapter();
  let date = adapter.parse("2024-01-15", timeZone)!;

  date = adapter.setHours(date, 15, timeZone);
  date = adapter.setMinutes(date, 0, timeZone);

  return adapter.setSeconds(date, 0, timeZone);
}

function mountUseDateTimeField(
  props: Partial<DateTimeFieldOwnProps> = {},
  global?: Partial<BridgeUIGlobal>,
) {
  let result!: ReturnType<typeof useDateTimeField>;

  const model = ref<Date | null | undefined>(null);
  const emit = vi.fn();

  const Wrapper = defineComponent({
    props: {} as Record<string, never>,
    setup() {
      result = useDateTimeField(props, model, emit);

      return () => h("div");
    },
  });

  mount(Wrapper, {
    global: {
      plugins: [createBridgeUI({ global })],
    },
  });

  return { emit, model, result };
}

test("it should start closed", () => {
  const { result } = mountUseDateTimeField();

  expect(result.open.value).toBe(false);
});

test("it should expose null modelValue by default", () => {
  const { result } = mountUseDateTimeField();

  expect(result.modelValue.value).toBeNull();
});

test("it should emit a UTC instant for Sao Paulo wall clock", () => {
  const { emit, result } = mountUseDateTimeField({}, { timeZone: SAO_PAULO });

  result.handlePickerChange(wallClock(SAO_PAULO));

  expect(emit.mock.calls[0][0]).toBe("change");
  expect(emit.mock.calls[0][1].toISOString()).toBe("2024-01-15T18:00:00.000Z");
});

test("it should use UTC on one field without converting from Sao Paulo", () => {
  const { emit, result } = mountUseDateTimeField(
    { timeZone: "UTC" },
    { timeZone: SAO_PAULO },
  );

  result.handlePickerChange(wallClock("UTC"));

  expect(emit.mock.calls[0][1].toISOString()).toBe("2024-01-15T15:00:00.000Z");
});
