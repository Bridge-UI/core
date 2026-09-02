// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent } from "vue";

// ** Local Imports
import { useBaseField } from "@/Components/BaseField";

function mountUseBaseField(
  props: Parameters<typeof useBaseField>[0] = {},
  options: Parameters<typeof useBaseField>[2] = {},
) {
  let api: undefined | ReturnType<typeof useBaseField>;

  const Comp = defineComponent({
    setup() {
      api = useBaseField(props, undefined, options);
      return () => null;
    },
  });

  mount(Comp);

  return { api: api! };
}

test("it should merge default size and hideErrorMessage", () => {
  const { api } = mountUseBaseField();

  expect(api.merged.value.size).toBe("md");
  expect(api.merged.value.hideErrorMessage).toBe(false);
});

test("it should mark the field as invalidated when error is set", () => {
  const { api } = mountUseBaseField({ error: true });

  expect(api.invalidated.value).toBe(true);
});

test("it should expose start and end slot binds", () => {
  const { api } = mountUseBaseField();

  expect(api.startSlotBind.value.class).toContain("wrapper-start-slot");
  expect(api.endSlotBind.value.class).toContain("wrapper-end-slot");
});

test("it should resolve label for from controlId by default", () => {
  const { api } = mountUseBaseField({ controlId: "my-field" });

  expect(api.fieldLabelProps.value.for).toBe("my-field");
});

test("it should resolve label for via labelHtmlFor option", () => {
  const { api } = mountUseBaseField(
    { controlId: "my-field" },
    { labelHtmlFor: (id) => `${id}-input` },
  );

  expect(api.fieldLabelProps.value.for).toBe("my-field-input");
});

test("it should set for on fieldCornerProps to control id", () => {
  const { api } = mountUseBaseField({ controlId: "my-field" });

  expect(api.fieldCornerProps.value.for).toBe("my-field");
});

test("it should expose group bind with role group", () => {
  const { api } = mountUseBaseField({ controlId: "field-id" });

  expect(api.groupBind.value.role).toBe("group");
  expect(api.groupBind.value.id).toBe("field-id");
});

test("it should set aria-describedby to description id when description is shown", () => {
  const { api } = mountUseBaseField({
    description: "Helper",
    controlId: "field-id",
  });

  expect(api.ariaDescribedBy.value).toBe("field-id-description");
});

test("it should set aria-describedby to error id when error message is shown", () => {
  const { api } = mountUseBaseField({
    error: true,
    controlId: "field-id",
    errorMessage: "Required",
  });

  expect(api.ariaDescribedBy.value).toBe("field-id-error");
});
