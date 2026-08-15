// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import type { SetupContext } from "vue";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { useAutocomplete } from "@/Components/Autocomplete";
import type {
  AutocompleteEmits,
  AutocompleteOwnProps,
  SelectOption,
} from "@/Components/Autocomplete/autocomplete.types";

const options: SelectOption[] = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
];

function mountUseAutocomplete(props: Partial<AutocompleteOwnProps> = {}) {
  const model = ref<string | undefined>(undefined);
  const triggerRef = ref<null | HTMLInputElement>(null);
  const declarativeOptions = ref<SelectOption[]>([]);
  const emit = vi.fn() as unknown as SetupContext<AutocompleteEmits>["emit"];
  let result!: ReturnType<typeof useAutocomplete>;

  const Wrapper = defineComponent({
    setup() {
      result = useAutocomplete(
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
  const { result } = mountUseAutocomplete();

  expect(result.formField.merged.value.size).toBe("md");
  expect(result.formField.merged.value.color).toBe("primary");
  expect(result.formField.merged.value.variant).toBe("outline");
});

test("it should expose combobox semantics on trigger bind", () => {
  const { result } = mountUseAutocomplete();

  expect(result.triggerBind.value.role).toBe("combobox");
  expect(result.triggerBind.value["aria-expanded"]).toBe(false);
  expect(result.triggerBind.value["aria-controls"]).toBeTruthy();
});

test("it should start closed", () => {
  const { result } = mountUseAutocomplete();

  expect(result.open.value).toBe(false);
});

test("it should default listbox showFooter to true for dialog overlays", () => {
  const { result } = mountUseAutocomplete({ overlay: "modal" });

  expect(result.listboxProps.value.showFooter).toBe(true);
});

test("it should default listbox showFooter to false for menu overlays", () => {
  const { result } = mountUseAutocomplete({ overlay: "menu" });

  expect(result.listboxProps.value.showFooter).toBe(false);
});

test("it should reflect selected value in display for single mode", async () => {
  const { model, result } = mountUseAutocomplete();

  model.value = "active";

  await Promise.resolve();

  expect(result.triggerBind.value.value).toBe("Active");
});

test("it should enable clear bind when value is set", async () => {
  const { model, result } = mountUseAutocomplete();

  model.value = "active";

  await Promise.resolve();

  expect(result.hasValue.value).toBe(true);
  expect(result.clearable.value).toBe(true);
  expect(result.clearBind.value["data-autocomplete-clear"]).toBe(true);
});

test("it should resolve visible options from props", () => {
  const { result } = mountUseAutocomplete();

  expect(result.visibleOptions.value).toHaveLength(2);
  expect(result.visibleOptions.value[0]?.label).toBe("Active");
});

test("it should apply invalidated listbox palette when field is invalid", () => {
  const { result } = mountUseAutocomplete({ error: true });

  expect(result.formField.invalidated.value).toBe(true);
});
