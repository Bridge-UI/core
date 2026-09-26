// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { useRating, type RatingOwnProps } from "@/Components/Rating";

function mountUseRating(
  props: RatingOwnProps = {},
  modelValue?: null | number,
) {
  let result!: ReturnType<typeof useRating>;

  const model = ref<null | number | undefined>(modelValue);

  const Wrapper = defineComponent({
    inheritAttrs: false,
    setup() {
      result = useRating(props, model);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should start empty with five items", () => {
  const result = mountUseRating();

  expect(result.value.value).toBeNull();
  expect(result.icon.value).toBe("star");
  expect(result.items.value).toHaveLength(5);
});

test("it should select and clear from item clicks", async () => {
  const result = mountUseRating();

  result.items.value[2]?.itemBind.onClick?.();

  expect(result.value.value).toBe(3);

  result.items.value[2]?.itemBind.onClick?.();

  expect(result.value.value).toBeNull();
});

test("it should update the model when an item is clicked", () => {
  const result = mountUseRating({ max: 5 }, 2);

  result.items.value[3]?.itemBind.onClick?.();

  expect(result.value.value).toBe(4);
});

test("it should clamp the value to max", () => {
  const result = mountUseRating({ max: 3 }, 9);

  expect(result.value.value).toBe(3);
  expect(result.items.value).toHaveLength(3);
});

test("it should expose a halfway fill for a fractional value", () => {
  const result = mountUseRating({ max: 5 }, 1.5);

  expect(result.value.value).toBe(1.5);
  expect(result.items.value[2]?.fill).toBe(0);
  expect(result.items.value[0]?.fill).toBe(1);
  expect(result.items.value[1]?.fill).toBe(0.5);
});
