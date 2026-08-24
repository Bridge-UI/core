// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, reactive } from "vue";

// ** Local Imports
import type { DataTableVisibilityItem } from "@/Components/DataTable/composables/useDataTable";
import { useDataTableColumnsMenu } from "@/Components/DataTable/composables/useDataTableColumnsMenu";

const items: DataTableVisibilityItem[] = [
  { id: "name", label: "Name", hidden: false, hideable: true },
  { id: "role", label: "Role", hidden: false, hideable: true },
  { id: "id", label: "Id", hidden: true, hideable: false },
];

function mountUseDataTableColumnsMenu(
  options: {
    items?: DataTableVisibilityItem[];
    overlay?: "auto" | "menu" | "modal" | "drawer";
    showFooter?: boolean;
  } = {},
) {
  const onChange = vi.fn();
  let result!: ReturnType<typeof useDataTableColumnsMenu>;

  const props = reactive({
    overlay: options.overlay,
    items: options.items ?? items,
    showFooter: options.showFooter,
  });

  const Consumer = defineComponent({
    setup() {
      result = useDataTableColumnsMenu(props, onChange);

      return () => h("div");
    },
  });

  mount(Consumer);

  return { result, onChange };
}

test("it should hide the footer for a menu overlay", () => {
  const { result } = mountUseDataTableColumnsMenu({ overlay: "menu" });

  expect(result.showFooter.value).toBe(false);
});

test("it should show the footer for a modal overlay", () => {
  const { result } = mountUseDataTableColumnsMenu({ overlay: "modal" });

  expect(result.showFooter.value).toBe(true);
});

test("it should commit live when the footer is hidden", () => {
  const { result, onChange } = mountUseDataTableColumnsMenu({
    overlay: "menu",
  });

  result.onToggleItem(items[1]!);

  expect(onChange).toHaveBeenCalledWith(["id", "role"]);
});

test("it should keep toggles in draft until apply when the footer is shown", () => {
  const { result, onChange } = mountUseDataTableColumnsMenu({
    overlay: "modal",
  });

  result.show.value = true;
  result.onToggleItem(items[1]!);

  expect(onChange).not.toHaveBeenCalled();
  expect(result.isHidden(items[1]!)).toBe(true);

  result.onApply();

  expect(onChange).toHaveBeenCalledWith(["id", "role"]);
  expect(result.show.value).toBe(false);
});

test("it should reset hideable columns in the draft", () => {
  const hiddenItems: DataTableVisibilityItem[] = [
    { id: "name", hidden: true, label: "Name", hideable: true },
    { id: "role", label: "Role", hidden: false, hideable: true },
    { id: "id", label: "Id", hidden: true, hideable: false },
  ];
  const { result, onChange } = mountUseDataTableColumnsMenu({
    overlay: "modal",
    items: hiddenItems,
  });

  result.show.value = true;
  result.onReset();
  result.onApply();

  expect(onChange).toHaveBeenCalledWith(["id"]);
});
