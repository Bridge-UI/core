// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import type { SetupContext } from "vue";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { useSelect } from "@/Components/Select";
import type {
  SelectEmits,
  SelectOption,
  SelectOwnProps,
} from "@/Components/Select/select.types";

const options: SelectOption[] = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
];

function mountUseSelect(props: Partial<SelectOwnProps> = {}) {
  const model = ref<string | undefined>(undefined);
  const triggerRef = ref<null | HTMLInputElement>(null);
  const declarativeOptions = ref<SelectOption[]>([]);
  const emit = vi.fn() as unknown as SetupContext<SelectEmits>["emit"];
  let result!: ReturnType<typeof useSelect>;

  const Wrapper = defineComponent({
    setup() {
      result = useSelect(
        { options, ...props },
        model,
        triggerRef,
        emit,
        declarativeOptions,
      );

      return () => h("input", { ref: triggerRef });
    },
  });

  mount(Wrapper);

  return { emit, model, result, triggerRef };
}

test("it should merge default form field size and variant", () => {
  const { result } = mountUseSelect();

  expect(result.formField.merged.value.size).toBe("md");
  expect(result.formField.merged.value.variant).toBe("outline");
  expect(result.formField.merged.value.color).toBe("primary");
});

test("it should expose combobox semantics on trigger bind", () => {
  const { result } = mountUseSelect();

  expect(result.triggerBind.value.role).toBe("combobox");
  expect(result.triggerBind.value["aria-expanded"]).toBe(false);
  expect(result.triggerBind.value["aria-controls"]).toBeTruthy();
});

test("it should start closed", () => {
  const { result } = mountUseSelect();

  expect(result.open.value).toBe(false);
});

test("it should reflect selected value in display for single mode", async () => {
  const { model, result } = mountUseSelect();

  model.value = "active";

  await Promise.resolve();

  expect(result.triggerBind.value.value).toBe("Active");
});

test("it should enable clear bind when value is set", async () => {
  const { model, result } = mountUseSelect();

  model.value = "active";

  await Promise.resolve();

  expect(result.hasValue.value).toBe(true);
  expect(result.clearable.value).toBe(true);
  expect(result.clearBind.value["data-select-clear"]).toBe(true);
});

test("it should resolve visible options from props", () => {
  const { result } = mountUseSelect();

  expect(result.visibleOptions.value).toHaveLength(2);
  expect(result.visibleOptions.value[0]?.label).toBe("Active");
});

test("it should apply invalidated listbox palette when field is invalid", () => {
  const { result } = mountUseSelect({ error: true });

  expect(result.formField.invalidated.value).toBe(true);
});
