// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { computed, defineComponent, h, ref } from "vue";

// ** Local Imports
import { useRating, type RatingOwnProps } from "@/Components/Rating";

const libDefaults = {
  max: 5,
  size: "md",
  icon: "star",
  rounded: "sm",
  color: "primary",
} as const satisfies Partial<RatingOwnProps>;

function mountUseRating(
  props: RatingOwnProps = {},
  modelValue?: null | number,
) {
  let result!: ReturnType<typeof useRating>;

  const modelRef = ref<null | number | undefined>(modelValue);
  const uncontrolled = ref<null | number>(props.defaultValue ?? null);

  const model = computed({
    get: () => {
      return modelRef.value === undefined ? uncontrolled.value : modelRef.value;
    },
    set: (next: null | number) => {
      uncontrolled.value = next;
      modelRef.value = next;
    },
  });

  const Wrapper = defineComponent({
    inheritAttrs: false,
    setup() {
      result = useRating(() => props, libDefaults, model);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should start empty with five items", () => {
  const result = mountUseRating();

  expect(result.value.value).toBeNull();
  expect(result.items.value).toHaveLength(5);
  expect(result.icon.value).toBe("star");
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
